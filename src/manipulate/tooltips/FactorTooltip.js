import React from 'react'

const propertyRow = (property) => {
  if (!property.testValue) {
    return null
  }

  function isFactor(property) {
    return property.contrastPropertyType === `FACTOR`
  }

  const style = {whiteSpace: `normal`}

  if (isFactor(property)) {
    style[`fontWeight`] = `bold`
  } else {
    style[`color`] = `gray`
  }

  return (
    <tr key={property.propertyName}>
      <td style={style}>{property.propertyName}</td>
      <td style={style}>{property.testValue}</td>
    </tr>
  )
}

const FactorTooltip = (props) => {
  const propertyNames = props.properties
      .map(e => e.propertyName)
      .filter((e,ix,self) => self.indexOf(e) === ix)

  return (
    <div className="gxaFactorTooltip">
      <table>
        <thead>
        <tr>
          <th>Property</th>
          <th>Value{props.replicates ? ` (N=${props.replicates})` : ``}</th>
        </tr>
        </thead>
        <tbody>
        {propertyNames.map(propertyName => {
          const values = props.properties
              .filter(e => e.propertyName === propertyName)
              .map((e)=>e.testValue)
              .filter((e,ix,self)=>self.indexOf(e) === ix)

          return {
            propertyName: propertyName,
            testValue:
              values.length
                ? values.reduce((l,r) => `${l}, ${r}`)
                : ``
          }
        }).map(propertyRow)}
        </tbody>
      </table>
    </div>
  )
}

export default FactorTooltip
