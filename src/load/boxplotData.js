const quartilesFromExpression = (expression, ix) => (
  expression.quartiles
  ? [{
      x: ix,
      low: expression.quartiles.min,
      q1: expression.quartiles.lower,
      median: expression.quartiles.median,
      q3: expression.quartiles.upper,
      high: expression.quartiles.max
    }]
  : []
)

const loosePointsFromExpression = (expression, ix) => (
  expression.quartiles
  ? []
  : [{x:ix, y: expression.value}]
)

const tryCreateBoxplotData = ({dataRow, columnHeaders}) => {
  const boxplotSeries =
    [].concat.apply([],
      dataRow.expressions
      .map(quartilesFromExpression)
    )

  const loosePointsSeries =
    [].concat.apply([],
      dataRow.expressions
      .map(loosePointsFromExpression)
    )

  if(boxplotSeries.length){
    return {
        boxplotSeries,
        loosePointsSeries,
        xAxisCategories: columnHeaders.map((header) => header.factorValue),
        title: dataRow.name === dataRow.id ? dataRow.name : `${dataRow.name} - ${dataRow.id}`,
        unit: dataRow.expressionUnit
    }
  } else {
    return null
  }
}

export default ({profiles, columnHeaders}) =>
    profiles.rows.length === 1
    ? tryCreateBoxplotData({dataRow: profiles.rows[0],columnHeaders})
    : null
