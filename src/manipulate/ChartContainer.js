import React from 'react'
import PropTypes from 'prop-types'
import uncontrollable from 'uncontrollable'

import HeatmapWithControls from './HeatmapWithControls.js'
import Boxplot from '../show/BoxplotCanvas.js'
import {chartDataPropTypes} from './chartDataPropTypes.js'

const Heatmap = uncontrollable(HeatmapWithControls, {
  selectedGenomeBrowser: `onSelectGenomeBrowser`,
  selectedOrderingName: `onSelectOrdering`,
  selectedFilters: `onSelectFilters`,
  coexpressionsShown: `onCoexpressionOptionChange`,
  zoom: `onZoom`
})
//starting values on component creation, managed by uncontrollable later
const heatmapDefaults = ({orderings, expressionLevelFilters, groupingFilters, heatmapConfig}) => ({
  defaultSelectedGenomeBrowser: `none`,
  defaultSelectedOrderingName: orderings.default.name,
  defaultSelectedFilters:
    [expressionLevelFilters, ...groupingFilters].map(filter =>
    ({
        name: filter.name,
        valueNames: filter.values.filter(fv => !fv.disabled).map(fv => fv.name) // Deep copy from props
    })
  ),
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
                  ontologyIdsToHighlight={this.props.ontologyIdsToHighlight}
                  onOntologyIdIsUnderFocus={this.props.onOntologyIdIsUnderFocus}
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
    chartData: chartDataPropTypes.isRequired,
    ontologyIdsToHighlight: PropTypes.arrayOf(PropTypes.string).isRequired,
    onOntologyIdIsUnderFocus: PropTypes.func.isRequired
}

export default ChartContainer
