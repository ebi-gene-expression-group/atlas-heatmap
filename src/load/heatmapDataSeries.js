import _ from 'lodash'

import {isMultiExperiment, isBaseline, isDifferential} from './experimentTypeUtils'

// Returns an object with coordinates, expression value and other properties for each heat map cell
const buildHeatMapDataPointFromExpression = ({rowInfo, rowIndex, expression, expressionIndex})=> (
  expression.hasOwnProperty(`value`)
    ? {
      x: expressionIndex,
      y: rowIndex,
      value: expression.value,
      info: rowInfo
    }
    : expression.hasOwnProperty(`foldChange`)
      ? {
        x: expressionIndex,
        y: rowIndex,
        value: expression.foldChange,
        info: {
          pValue: expression.pValue,
          foldChange: expression.foldChange,
          tStat: expression.tStat,
          ...rowInfo
        }
      }
      : null
)

const buildDataPointsFromRowExpressions = ({rowInfo, row: {expressions}, rowIndex}) => (
  expressions
    .map((expression, expressionIndex) => (
      buildHeatMapDataPointFromExpression({rowInfo, rowIndex, expression, expressionIndex})
    ))
    .filter((el) => el)
)

// Returns lodash wrapper of an array with alternating entries of experiment type and an array of data points of that
// type
const _createDataPointsAndGroupThemByExperimentType = profilesRowsChain => (
  profilesRowsChain
    .map((row, rowIndex) =>
      [ row.experimentType,
        buildDataPointsFromRowExpressions({rowInfo: { type: row.experimentType, description: row.name , unit: row.expressionUnit }, row, rowIndex}) ])
    .groupBy(experimentTypeAndRow => experimentTypeAndRow[0])
    // Just leave the data points...
    .mapValues(rows => rows.map(experimentTypeAndRow => experimentTypeAndRow[1]))
    // Next, flatten all data point arrays into a single one for each experiment type:
    // {'rnaseq_mrna_baseline': [[v1],[v2,v3],[v4,v5,v6]]} => {'rnaseq_mrna_baseline': [[v1,v2,v3,v4,v5,v6]]}
    .mapValues(_.flatten)
    // Return an array of two-element arrays instead of array of objects:
    // {'rnaseq_mrna_baeline': [...], 'proteomics_baseline': [...]} =>
    //    [['rnaseq_mrna_baseline, [...]], ['proteomics_baseline', [...]]]
    .toPairs()
)


// Returns a function that, when passed an experimentType and an array of dataPoints, maps the array to pairs where the
// first element is the position in the thresholds array for that experiment type (e.g. 0, 1, 2, 3 for “Below cutoff”,
// “Low”, “Medium” and “High”, respectively) according to its value, and the second is the dataPoint itself
const dataPointsToThresholdCategoriesMapper = thresholds =>
  (experimentType, dataPoints) => {
    return dataPoints.map(
      dataPoint => [_.sortedIndex(thresholds[experimentType] || thresholds.DEFAULT, dataPoint.value), dataPoint]
    )
  }

// Produces an array with as many thresholds/seriesNames/seriesColours each array entry contains an object with an
// info field (an object composed of the series/threshold name and colour) and a data array with the data points that
// correspond to that threshold
const experimentProfilesRowsAsDataPointsSplitByThresholds = (thresholds, seriesNames, seriesColours, profilesRows) =>
  _bucketsIntoSeries(seriesNames, seriesColours)(
    // Get lodash wrapper of the experiment type / data points array
    _createDataPointsAndGroupThemByExperimentType(_.chain(profilesRows))
    // Map arrays of exp. type and data points to arrays of [threshold group index, data point]
      .map(_.spread(dataPointsToThresholdCategoriesMapper(thresholds)))
      // After this flatten we have all the data points categorised by threshold in a single array... hooray!
      .flatten()
  ).value()

// Create the array of pairs in a single experiment to be passed to _bucketsIntoSeries
function bucketByLogRange(data, names, colours) {
  if (!data.length) return []

  const logValues = data.map(p => Math.log(p.value + 1))
  const minLog = Math.min(...logValues)
  const maxLog = Math.max(...logValues)
  const numBuckets = Math.min(names.length, colours.length)

  const step = (maxLog - minLog) / numBuckets

  const buckets = names.slice(0, numBuckets).map((name, i) => ({
    info: { name, colour: colours[i], thresholds: [] },
    data: []
  }))

  data.forEach((point, index) => {
    const logVal = Math.log(point.value + 1)
    let idx = Math.floor((logVal - minLog) / step)
    if (idx >= numBuckets) idx = numBuckets - 1 // edge case for max value
    buckets[idx].data.push(point)
  })

  return buckets
}

const splitGeneRowsIntoProportionalSeriesOfDataPoints = (profilesRows, experiment, filters, names, colours) => {
  const dataPoints =
    _.flatten(profilesRows.map(
      (row, rowIndex) => buildDataPointsFromRowExpressions({rowInfo: {unit: row.expressionUnit}, row, rowIndex})))

  return _.flatten(
    _.range(filters.length).map(
      i => bucketByLogRange(dataPoints.filter(filters[i]), names[i], colours[i])))
}

// chain is a lodash wrapper of an array of pairs: [[0, dataPoint1], [0, dataPoint2], ... [3, dataPointN]]
// The first entry is the number of the category (i.e. “Below cutoff”, ”Low”...) and the second entry is the data point
// Returns an array
//    [{info: {...}, data:[data points of category 0]}, {info: {...}, data:[data points of category 1]}], etc.
const _bucketsIntoSeries = _.curry((seriesNames, seriesColours, pairsOfCategoryAndDataPointChain) => {
  return (
    pairsOfCategoryAndDataPointChain
      .groupBy(categoryAndDataPoint => categoryAndDataPoint[0])
      .mapValues(pairs => pairs.map(categoryAndDataPoint => categoryAndDataPoint[1]))
      .transform(
        (result, bucketValues, bucketNumber) => { result[bucketNumber].data = bucketValues },
        // The empty with the series info but no data points
        _.range(seriesNames.length).map(
          i => ({
            info: {
              name: seriesNames[i],
              colour: seriesColours[i]
            },
            data: []
          })
        )
      )
  )
})

const getDataSeries = (profilesRows, experiment) => {
  const _fns = [_.lt, _.eq, _.gt].map(f => (point => f(point.value, 0)))
  const _belowCutoff = _fns[1]

  if (isDifferential(experiment)) {
    return splitGeneRowsIntoProportionalSeriesOfDataPoints(profilesRows, experiment,
      _fns,
      [[`High down`, `Down`], [`Below cutoff`], [`Up`, `High up`]],
      [[`#0000ff`, `#8cc6ff`], [`gainsboro`], [`#e9967a`, `#b22222`]])
  } else if (isBaseline(experiment)) {
    return splitGeneRowsIntoProportionalSeriesOfDataPoints(profilesRows, experiment,
      [_belowCutoff, _.negate(_belowCutoff)],
      [[`Below cutoff`], [`Low`, `Medium`, `High`]],
      [[`gainsboro`], [`#8cc6ff`, `#0000ff`, `#0000b3`]])
  } else if (isMultiExperiment(experiment)) {
    return experimentProfilesRowsAsDataPointsSplitByThresholds(
      {
        RNASEQ_MRNA_BASELINE: [0, 10, 1000],
        PROTEOMICS_BASELINE: [0, 0.001, 8],
        DEFAULT: [0, 10, 1000]
      },
      [`Below cutoff`, `Low`, `Medium`, `High`],
      [`#eaeaea`, `#45affd`, `#1E74CA`, `#024990`],
      profilesRows)
  } else {
    return null
  }
}

export default getDataSeries
