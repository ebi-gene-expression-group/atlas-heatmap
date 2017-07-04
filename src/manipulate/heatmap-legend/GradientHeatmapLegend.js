import React from 'react'
import PropTypes from 'prop-types'

import {numberWithCommas} from '../../utils.js'

import './GradientHeatmapLegend.css'

const renderGradient = ({fromValue, toValue, colours}, index) => {
    const spanStyle = { backgroundImage: `linear-gradient(to right, ${colours.join(`, `)})` }

    return (
        fromValue < toValue ?
            <div style={{display: `table-row`}} key={`gradient_${index}`}>
                <div className="gxaGradientLevel gxaGradientLevelMin">{numberWithCommas(fromValue)}</div>
                <div style={{display: `table-cell`, verticalAlign: `middle`}}>
                    <span className="gxaGradientColour" style={spanStyle} />
                </div>
                <div className="gxaGradientLevel gxaGradientLevelMax">{numberWithCommas(toValue)}</div>
            </div> :
            null
    )
}

const GradientHeatmapLegend = ({gradients, unit}) => (
  <div className="gxaGradientLegend">
    <div>
      {
        ! unit
        ? <span>
            Expression level
          </span>
        : unit.indexOf("fold change") > -1
          ? <span>
              Log<sub>2</sub>-fold change
            </span>
          : <span>
              Expression level in {unit}
            </span>
      }
    </div>
    {
      gradients
      .map(renderGradient)
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
