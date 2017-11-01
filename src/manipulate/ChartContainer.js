import React from 'react'

import Heatmap from './HeatmapWithControls.js'
import Boxplot from '../show/BoxplotCanvas.js'
import Transcripts from '../show/AsyncLoadedTranscripts.js'
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
        return this.state.chartType === `heatmap` ? `boxplot` : `heatmap`
    }

    _handleClick(e) {
        e.preventDefault()
        this.setState({ chartType: this._theOtherChartType() })
    }

    render() {
        return (
            <div style={{width: `100%`}}>
              {this.props.chartData.boxplotData &&
                  <a href="#" onClick={this.handleClick}>
                    {`Switch to ${this._theOtherChartType()} view`}
                  </a>
              }
              <div style={{display: this.state.chartType === `heatmap` ? `block` : `none`, width: `100%`}} >
                <Heatmap {...this.props.chartData} />
              </div>
              { this.props.chartData.boxplotData &&
                <div style={{display: this.state.chartType === `boxplot` ? `block` : `none`, width: `100%`}} >
                    <Boxplot {...this.props.chartData.boxplotData} />
                </div>
              }
              { this.props.chartData.transcriptsData &&
                <div style={{display: this.state.chartType === `boxplot` ? `block` : `none`, width: `100%`}} >
                  <Transcripts {...this.props.chartData.transcriptsData} />
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
