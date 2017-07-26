import React from 'react'

import Heatmap from './HeatmapWithControls.js'
import Boxplot from '../show/BoxplotCanvas.js'
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
            <div>
              {this.props.chartData.boxplotData &&
                  <a href="#" onClick={this.handleClick}>
                    {`Switch to ${this._theOtherChartType()} view`}
                  </a>
              }
              <div className={this.state.chartType === 'heatmap' ? '' : 'hidden' } >
                <Heatmap
                  {...this.props.chartData}/>
              </div>
              { this.props.chartData.boxplotData &&
                <div className={this.state.chartType === 'boxplot' ? '' : 'hidden' } >
                  <Boxplot {...this.props.chartData.boxplotData} />
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
