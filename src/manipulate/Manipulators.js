/*
 All functions in this module accept and return a following format of data:
 {
     dataSeries : [info: {...: String}, data: [Point]}]
     xAxisCategories: [X axis label]
     yAxisCategories: [Y axis label]
 }
 */

const orderHeatmapData = (ordering, data) => {
  const permuteX = x => ordering.columns.indexOf(x)
  const permuteY = y => ordering.rows.indexOf(y)

  const permutePoint = point => ({
    x: permuteX(point.x),
    y: permuteY(point.y),
    value: point.value,
    info: point.info
  })

  const permuteArray = (arr, permute) =>
    arr.map( (el, ix) => [el, permute(ix)] )
      .sort( (l,r) => l[1] - r[1] )
      .map( el => el[0] )

  return {
    dataSeries: data.dataSeries.map(series => ({
      info: series.info,
      data: series.data.map(permutePoint) })
    ),
    xAxisCategories: permuteArray(data.xAxisCategories, permuteX),
    yAxisCategories: permuteArray(data.yAxisCategories, permuteY)
  }
}

const _axisElementsForFilteredDataSeries = (axis, conditionPerSeries, conditionPerPoint, dataSeries) => {
  return (
    dataSeries
      .filter(conditionPerSeries)
      .map(e => e.data)
      .reduce((l,r)=> l.concat(r),[])
      .filter(conditionPerPoint)
      .map(e => e[axis])
      .filter((e,ix,self) => self.indexOf(e) === ix)  // unique
      .sort((l,r) => l-r)
  )
}

const _filterHeatmapData = (keepSeries, keepPoint, data) => {
  const allXs = _axisElementsForFilteredDataSeries(`x`, keepSeries, keepPoint, data.dataSeries)
  const allYs = _axisElementsForFilteredDataSeries(`y`, keepSeries, keepPoint, data.dataSeries)

  const newDataSeries =
    data.dataSeries
      .map((series, ix) => keepSeries(series,ix) ?
        series.data.filter(keepPoint) :
        []
      )
      .map(series =>
        series
          .map(point =>
            ({
              x: allXs.indexOf(point.x),
              y: allYs.indexOf(point.y),
              value: point.value,
              info: point.info
            })
          )
          .filter(point => point.x > -1 && point.y > -1)
      )

  return {
    dataSeries: data.dataSeries.map((e, ix) =>
      ({
        info: e.info,
        data: newDataSeries[ix]
      })
    ),
    xAxisCategories: data.xAxisCategories.filter((e, ix) => allXs.includes(ix)),
    yAxisCategories: data.yAxisCategories.filter((e, ix) => allYs.includes(ix))
  }
}

const filterHeatmapData = (keepSeries, keepRow, keepColumn, data) => {
  return _filterHeatmapData(
    keepSeries,
    point => keepRow(data.yAxisCategories[point.y]) && keepColumn(data.xAxisCategories[point.x]),
    data
  )
}

const _calculateInserts = (fullColumns, originalColumns) => {
  const result = []
  let fullColumnsCursor=0
  let originalColumnsCursor=0

  while(fullColumnsCursor<fullColumns.length && originalColumnsCursor < originalColumns.length) {
    if(fullColumns.length > fullColumnsCursor
      && originalColumns.length > originalColumnsCursor
      && fullColumns[fullColumnsCursor] === originalColumns[originalColumnsCursor]) {
      result.push(``)
      fullColumnsCursor++
      originalColumnsCursor++

    } else if(fullColumns.length > fullColumnsCursor) {
      result.push(fullColumns[fullColumnsCursor])
      fullColumnsCursor++

    } else if(originalColumns[originalColumnsCursor].length > originalColumnsCursor) {
      result.push(``)
      originalColumnsCursor++
    }
  }
  return result
}

const _indicesForInserts = inserts => {
  let i = -1
  return inserts.map(e => {
    !e && i++
    return i })
}

const insertEmptyColumns = (newColumns, data) => {
  const fullColumns =
    newColumns.concat(
      data.xAxisCategories
        .filter(originalColumn => newColumns.findIndex(e => e.label === originalColumn.label) === -1)
    )

  const insertIndices =
    _indicesForInserts(
      _calculateInserts(fullColumns.map(e => e.label), data.xAxisCategories.map(e => e.label))
    )

  return {
    dataSeries: data.dataSeries.map(e =>
      ({
        info: e.info,
        data: e.data.map(point =>
          ({
            ...point,
            x: insertIndices.indexOf(point.x)
          })
        )
      })
    ),
    xAxisCategories: fullColumns,
    yAxisCategories: data.yAxisCategories
  }
}

const manipulate = (args, data) => {
  const orderedHeatmapData = orderHeatmapData(args.ordering, data)
  return insertEmptyColumns(
    args.allowEmptyColumns ? orderedHeatmapData.xAxisCategories : [],
    filterHeatmapData(args.keepSeries, args.keepRow, args.keepColumn, orderedHeatmapData)
  )
}

export {insertEmptyColumns, filterHeatmapData, orderHeatmapData, manipulate}
