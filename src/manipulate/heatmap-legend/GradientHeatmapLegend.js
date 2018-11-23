import React from 'react'
import PropTypes from 'prop-types'

import { numberWithCommas } from '../../utils.js'

const gradientColourStyle = {
  overflow: `auto`,
  height: `15px`,
  margin: `2px 6px 2px 6px`,
  verticalAlign: `middle`,
  width: `200px`,
  display: `inline-block`
}

const gradientLevelStyle = {
  whiteSpace: `nowrap`,
  fontSize: `10px`,
  verticalAlign: `middle`,
  display: `table-cell`
}

const gradientLevelMinStyle = {
  textAlign: `right`
}

const gradientLevelMaxStyle = {
  textAlign: `left`
}

const renderGradient = ({fromValue, toValue, colours}, index) => {
  const spanStyle = { backgroundImage: `linear-gradient(to right, ${colours.join(`, `)})` }

  return (
    fromValue < toValue ?
      <div style={{display: `table-row`}} key={`gradient_${index}`}>
        <div style={{...gradientLevelStyle, ...gradientLevelMinStyle}}>{numberWithCommas(fromValue)}</div>
        <div style={{display: `table-cell`, verticalAlign: `middle`}}>
          <span style={{...gradientColourStyle, ...spanStyle}} />
        </div>
        <div style={{...gradientLevelStyle, ...gradientLevelMaxStyle}}>{numberWithCommas(toValue)}</div>
      </div> :
      null
  )
}

const gradientLegendStyle = {
  fontSize: `12px`,
  padding: `12px 0`,
  marginLeft: `10px`,
  textAlign: `center`,
  display: `inline-block`
}

const GradientHeatmapLegend = ({gradients, unit}) => (
  gradients.some((gradient) => gradient.fromValue !== 0 || gradient.toValue !== 0) &&
  <div style={gradientLegendStyle}>
    <div>
      {
        ! unit ?
          <span>Expression level</span> :
          unit.includes(`fold change`) ?
            <span>Log<sub>2</sub>-fold change</span> :
            <span>Expression level in {unit}</span>
      }
    </div>
    {
      gradients.map(renderGradient)
    }
  </div>
)

GradientHeatmapLegend.propTypes = {
  gradients: PropTypes.arrayOf(PropTypes.shape({
    fromValue: PropTypes.number,
    toValue: PropTypes.number,
    colours: PropTypes.arrayOf(PropTypes.string)
  })).isRequired,
  unit: PropTypes.string.isRequired
}

export default GradientHeatmapLegend
