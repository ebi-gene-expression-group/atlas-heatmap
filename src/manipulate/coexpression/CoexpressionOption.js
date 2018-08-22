import React from 'react'
import PropTypes from 'prop-types'

import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import './CoexpressionOption.css'

class CoexpressionOption extends React.Component {
  _showOfferToDisplay() {
    return (
      <Button bsSize="xsmall" onClick={() => this.props.showCoexpressionsCallback(10)}>
        <Glyphicon glyph="th"/>
        <span style={{verticalAlign: `middle`}}> Add similarly expressed genes</span>
      </Button>
    )
  }

  _showSlider() {
    const marks = {
      0: `off`,
      10: `10`
    }
    marks[this.props.numCoexpressionsAvailable] = this.props.numCoexpressionsAvailable

    return(
      <div>
        <p>{`Display genes with similar expression to ${this.props.geneName}:`}</p>
        <div className="gxaSlider">
          <Slider min={0}
                  max={this.props.numCoexpressionsAvailable}
                  onAfterChange={this.props.showCoexpressionsCallback}
                  marks={marks} included={false} defaultValue={this.props.numCoexpressionsVisible}/>
        </div>
      </div>
    )
  }

  render() {
    return <div className="gxaDisplayCoexpressionOffer">
      {this.props.numCoexpressionsAvailable
        ? this.props.numCoexpressionsVisible
          ? this._showSlider()
          : this._showOfferToDisplay()
        : <span>{`No genes with similar expression to ${this.props.geneName} available for display`}</span>
      }
    </div>
  }
}

CoexpressionOption.propTypes = {
  geneName: PropTypes.string.isRequired,
  numCoexpressionsVisible: PropTypes.number.isRequired,
  numCoexpressionsAvailable: PropTypes.number.isRequired,
  showCoexpressionsCallback: PropTypes.func.isRequired
}

export default CoexpressionOption
