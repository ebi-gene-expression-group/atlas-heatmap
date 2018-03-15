import React from 'react'

import Heatmap from './HeatmapWithControls.js'
import GeneSpecificResults from './GeneSpecificResults.js'
import {chartDataPropTypes} from './chartDataPropTypes.js'

class ChartContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            chartType: `heatmap`
        }

        this.handleClick = this._handleClick.bind(this)
    }

    _theOtherChartType() {
        return this.state.chartType === `heatmap` ? `boxplot and transcripts` : `heatmap`
    }

    _handleClick(e) {
        e.preventDefault()
        this.setState({ chartType: this._theOtherChartType() })
    }

    render() {
        return (
            <div style={{width: `100%`}}>
              {this.props.chartData.geneSpecificResults &&
                  <a href="#" onClick={this.handleClick}>
                    {`Show ${this._theOtherChartType()} view`}
                  </a>
              }
              <div style={{display: this.state.chartType === `heatmap` ? `block` : `none`, width: `100%`}} >
                <Heatmap {...this.props.chartData} />
              </div>
              { this.props.chartData.geneSpecificResults &&
                <div style={{display: this.state.chartType === `boxplot and transcripts` ? `block` : `none`, width: `100%`}} >
                    <GeneSpecificResults {...this.props.chartData.geneSpecificResults} />
                </div>
              }
            </div>
        )
    }
}

ChartContainer.propTypes = {
    chartData: chartDataPropTypes.isRequired
}

export default ChartContainer
