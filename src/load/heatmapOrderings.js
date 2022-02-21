import _ from 'lodash'

import {isMultiExperiment, isDifferential} from './experimentTypeUtils.js'

//apply rank first, use comparator to resolve ties
const createOrdering = (rank, comparator, arr) =>
  arr
    .map((e,ix) => [e,ix])
    //lower ranks go to the beginning of series
    .sort((e_ixLeft, e_ixRight) =>
      rank[e_ixLeft[1]] - rank[e_ixRight[1]] || comparator(e_ixLeft[0], e_ixRight[0]))
    .map(e_ix => e_ix[1])

const createAlphabeticalOrdering = (property, arr) =>
  createOrdering(arr.map(_.constant(0)), comparatorByProperty(property), arr)

const comparatorByProperty = _.curry(
  (property, e1, e2) => e1[property].localeCompare(e2[property]))

const rankColumnsByWhereTheyAppearFirst = expressions => {
  return (
    _.chain(expressions)
      .map(row => row.map(e => +e.hasOwnProperty(`value`)))
      .thru(_.spread(_.zip))
      .map(column =>
        column
          .map((e, ix) => e * (ix + 1))
          .filter(_.identity))
      .map(_.min)
      .value()
  )
}

const highestColumnRankPossible = expressions => expressions.length ? expressions[0].length : Number.MAX_VALUE

const thresholdColumnsByExpressionAboveCutoff = expressions =>
  rankColumnsByExpression(expressions, 0)
  //check if the function assigned the rank value corresponding to everything filtered off
    .map(e => e === highestColumnRankPossible(expressions) ? 1 : 0)

const rankColumnsByExpression = (expressions, minimalExpression) => {
  const includeInRanking =
    typeof minimalExpression === `number` ?
      e => e.hasOwnProperty(`value`) && !isNaN(e.value) && Math.abs(e.value) > minimalExpression :
      e => e.hasOwnProperty(`value`) && !isNaN(e.value)

  return (
    _.chain(expressions)
      .map(row => {
        const valuesInRow = _.uniq(row.filter(includeInRanking)
          .map(e => e.value)
          .sort((l, r) => r - l))

        return ( row.map(e => includeInRanking(e) ? valuesInRow.indexOf(e.value) : `missing`) )
      })
      .thru(_.spread(_.zip))
      .map(ranks => ranks.filter(_.negate(isNaN)))
      .map(ranks => ranks.length ? _.sum(ranks) / ranks.length : highestColumnRankPossible(expressions))
      .value()
  )
}

const rankColumnsByThreshold = (threshold, expressions) =>
  expressions
    .map(row => row.map(point => +(point.hasOwnProperty(`value`) && point.value !== 0)))
    .reduce(function (r1, r2) {
      return r1.map((el, ix) => el + r2[ix], _.fill(Array(expressions.length ? expressions[0].length : 0), 0))
    }, [])
    .map(countOfExperimentsWhereTissueExpressedAboveCutoff =>
      countOfExperimentsWhereTissueExpressedAboveCutoff > expressions.length * threshold ? 0 : 1)

const noOrdering = arr => arr.map((el, ix) => ix)

const combineRanks = ranksAndWeights => {
  return (
    _.chain(ranksAndWeights)
      .map(rankAndWeight => rankAndWeight[0].map(rank => rank * rankAndWeight[1]))
      .thru(_.spread(_.zip))
      .map(_.sum)
      .value()
  )
}

const createOrderings = (expressions, columnHeaders, rows, experiment) => {
  const transposed = _.zip.apply(_, expressions)

  if (isMultiExperiment(experiment)) {
    return [
      {
        name: `By experiment type`,
        columns: createAlphabeticalOrdering(`factorValue`, columnHeaders),
        rows: noOrdering(rows)
      },
      {
        name: `Alphabetical order`,
        columns: createAlphabeticalOrdering(`factorValue`, columnHeaders),
        rows: createAlphabeticalOrdering(`name`, rows)
      },
      {
        name: `Expression rank`,
        columns: createOrdering(
          combineRanks([
            [rankColumnsByWhereTheyAppearFirst(expressions), 1],
            [rankColumnsByExpression(expressions), 1e3],
            [rankColumnsByThreshold(0.05 + 0.4/Math.pow(1 + transposed.length/8,0.4), expressions), 1e6],
            [thresholdColumnsByExpressionAboveCutoff(expressions), 1e7],
          ]),
          comparatorByProperty(`factorValue`), columnHeaders
        ),
        rows: createOrdering(
          combineRanks([
            [rankColumnsByExpression(transposed), 1e3],
            [rankColumnsByThreshold(0.05 + 0.4/(1 + expressions.length/5), transposed), 1e6]
          ]),
          comparatorByProperty(`name`), rows
        )
      }
    ]
  } else {
    return [
      {
        name: `Default`,
        columns: noOrdering(columnHeaders),
        rows: noOrdering(rows)
      }
    ]
  }
}

const extractExpressionValues = (rows, experiment) => {
  const _valueFieldExtractor = valueField =>
    expression => expression.hasOwnProperty(valueField) ? {value: expression[valueField]} : {}

  return rows.map(
    row => row.expressions.map(_valueFieldExtractor(isDifferential(experiment) ? `foldChange`: `value`)))
}

const createOrderingsForData = (experiment, rows, columnHeaders) =>
  createOrderings(extractExpressionValues(rows, experiment), columnHeaders, rows, experiment)

export default createOrderingsForData
