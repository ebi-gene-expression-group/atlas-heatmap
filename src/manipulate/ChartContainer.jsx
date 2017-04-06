import React from 'react';

import HeatmapWithControls from './HeatmapWithControls.jsx';
import BoxplotCanvas from '../show/BoxplotCanvas.jsx';

import {chartDataPropTypes} from './chartDataPropTypes.js';

class ChartContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartType: `heatmap`,
            selectedHeatmapOrderingName: props.chartData.orderings.default.name,
            selectedHeatmapFilters:
                [this.props.chartData.expressionLevelFilters, ...this.props.chartData.groupingFilters].map(filter =>
                ({
                    name: filter.name,
                    valueNames: filter.values.filter(fv => !fv.disabled).map(fv => fv.name) // Deep copy from props
                })
            ),
            heatmapCoexpressionsShown: 0,
            zoom: false
        };

        this.handleClick = this._handleClick.bind(this);

        this.onSelectHeatmapOrdering = this._onSelectHeatmapOrdering.bind(this);
        this.onSelectFilters = this._onSelectFilters.bind(this);
        this.onCoexpressionOptionChange = this._onCoexpressionOptionChange.bind(this);
        this.onZoom = this._onZoom.bind(this);
    }

    _onZoom(zoom) {
        this.setState({ zoom: zoom });
    }

    _onSelectFilters(filters) {
        this.setState({
            selectedHeatmapFilters: filters
        });
    }

    _onCoexpressionOptionChange(coexpressionsToShow) {
        this.setState({ heatmapCoexpressionsShown: coexpressionsToShow })
    }

    _onSelectHeatmapOrdering(orderingName) {
        this.setState({ selectedHeatmapOrderingName: orderingName })
    }

    _theOtherChartType() {
        return this.state.chartType === `heatmap` ? `boxplot` : `heatmap`;
    }

    _getChart() {
        switch (this.state.chartType) {
            case `heatmap`:
                return (
                    <HeatmapWithControls heatmapConfig={this.props.chartData.heatmapConfig}
                                         heatmapData={this.props.chartData.heatmapData}
                                         colourAxis={this.props.chartData.colourAxis}

                                         orderings={this.props.chartData.orderings}
                                         selectedOrderingName={this.state.selectedHeatmapOrderingName}
                                         onSelectOrdering={this.onSelectHeatmapOrdering}

                                         expressionLevelFilters={this.props.chartData.expressionLevelFilters}
                                         groupingFilters={this.props.chartData.groupingFilters}
                                         selectedFilters={this.state.selectedHeatmapFilters}
                                         onSelectFilters={this.onSelectFilters}

                                         coexpressionsShown={this.state.heatmapCoexpressionsShown}
                                         onCoexpressionOptionChange={this.onCoexpressionOptionChange}

                                         zoom={this.state.zoom}
                                         onZoom={this.onZoom}
                    />
                );
            case `boxplot`:
                // If the boxplot needs to have controls, add a BoxPlotWithControls component as above
                return (
                    <BoxplotCanvas title={this.props.chartData.boxplotData.title}
                                   categories={this.props.chartData.boxplotData.xAxisCategories}
                                   seriesData={this.props.chartData.boxplotData.dataSeries}
                                   unit={this.props.chartData.boxplotData.unit}
                    />
                );
            default:
                return null;
        }
    }

    _handleClick(e) {
        e.preventDefault();
        this.setState({ chartType: this._theOtherChartType() });
    }

    render() {
        return (
            <div>
                {this.props.chartData.boxplotData ?
                    <a href="#" onClick={this.handleClick}>{`Switch to ${this._theOtherChartType()} view`}</a> :
                    null}
                {this._getChart()}
            </div>
        );
    }

}

ChartContainer.propTypes = {
    chartData: chartDataPropTypes.isRequired,
    ontologyIdsToHighlight: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onOntologyIdIsUnderFocus: React.PropTypes.func.isRequired
};

export default ChartContainer;

