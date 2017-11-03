const quartilesFromExpression = (expression) => (
  expression.quartiles
  ? [
      expression.quartiles.min,
      expression.quartiles.lower,
      expression.quartiles.median,
      expression.quartiles.upper,
      expression.quartiles.max
    ]
  : []
)

const loosePointsFromExpression = (expression, ix) => (
  expression.quartiles
  ? []
  : [{x:ix, y: expression.value}]
)

const tryCreateBoxplotData = ({dataRow, columnHeaders}) => {
  const boxplotSeries =
    dataRow.expressions
    .map(quartilesFromExpression)

  const loosePointsSeries =
    [].concat.apply([],
      dataRow.expressions
      .map(loosePointsFromExpression)
    )

  if(boxplotSeries.map((e)=>e.length).reduce((l,r)=>l+r, 0)){
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
