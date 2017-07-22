import React from 'react'
import uncontrollable from 'uncontrollable'

import HeatmapWithControls from './HeatmapWithControls.js'
import Boxplot from '../show/BoxplotCanvas.js'
import {chartDataPropTypes} from './chartDataPropTypes.js'

const Heatmap = uncontrollable(HeatmapWithControls, {
  selectedGenomeBrowser: `onSelectGenomeBrowser`,
  selectedOrderingName: `onSelectOrdering`,
  selectedColumnLabels: `onSelectColumnLabels`,
  coexpressionsShown: `onCoexpressionOptionChange`,
  zoom: `onZoom`
})
//starting values on component creation, managed by uncontrollable later
const heatmapDefaults = ({heatmapData:{xAxisCategories}, orderings, groupingFilters, heatmapConfig}) => ({
  defaultSelectedGenomeBrowser: `none`,
  defaultSelectedOrderingName: orderings.default.name,
  defaultSelectedColumnLabels: xAxisCategories.map((columnHeader)=> columnHeader.label),
  defaultCoexpressionsShown: 0,
  defaultZoom: false
})

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
                  {...this.props.chartData}
                  {...heatmapDefaults(this.props.chartData)}/>
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
