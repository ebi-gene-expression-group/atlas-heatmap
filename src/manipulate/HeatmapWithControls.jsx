import React from 'react';

import OrderingsDropdown from './controls/OrderingsDropdown.jsx';
import FiltersModal from './controls/filter/FiltersModal.jsx';
import DownloadButton from './controls/download-button/DownloadButton.jsx';

import TooltipStateManager from './tooltips/TooltipStateManager.jsx';
import HeatmapCanvas from '../show/HeatmapCanvas.jsx';

import tooltipsFactory from './tooltips/main.jsx';
import cellTooltipFormatter from './formatters/heatmapCellTooltipFormatter.jsx';
import axesFormatters from './formatters/axesFormatters.jsx';

import HeatmapLegend from './heatmap-legend/HeatmapLegend.jsx';
import CoexpressionOption from './coexpression/CoexpressionOption.jsx';

import {manipulate} from './Manipulators.js';

import {heatmapDataPropTypes, heatmapConfigPropTypes, orderingsPropTypesValidator, filterPropTypes, colourAxisPropTypes}
from '../manipulate/chartDataPropTypes.js';

class HeatmapWithControls extends React.Component {
    constructor(props) {
        super(props);
    }

    _getSelectedExpressionLevelFilters() {
        return this.props.selectedFilters
            .find(selectedFilter => selectedFilter.name === this.props.expressionLevelFilters.name)
            .valueNames;
    }

    _getSelectedOrdering() {
        const selectedOrderingKey =
            Object.keys(this.props.orderings).find(
                orderingKey => this.props.orderings[orderingKey].name === this.props.selectedOrderingName
            );
        return this.props.orderings[selectedOrderingKey];
    }

    _heatmapDataToPresent() {
        return manipulate(
            {
                //this.state.selectedHeatmapFilters
                //.find(selectedFilter => selectedFilter.name === this.props.chartData.expressionLevelFilters.name)
                //.valueNames
                keepSeries: series => this.props.selectedFilters[0].valueNames.includes(series.info.name),
                keepRow: this.props.heatmapConfig.coexpressionsAvailable ?
                    rowHeader => this._rowHeadersThatCoexpressionSliderSaysWeCanInclude().includes(rowHeader.label) :
                    () => true,
                keepColumn: this.props.groupingFilters.length > 0 ?
                    columnHeader =>
                        this._columnHeadersThatColumnGroupingFiltersSayWeCanInclude().includes(columnHeader.label) :
                    () => true,
                ordering: this._getSelectedOrdering(),
                allowEmptyColumns: Boolean(this.props.heatmapConfig.experiment)
            },
            this.props.heatmapData
        )
    }

    _rowHeadersThatCoexpressionSliderSaysWeCanInclude() {   // to keep up with the quirky function names
        return this.props.heatmapData.yAxisCategories
            .slice(0, this.props.coexpressionsShown + 1)
            .map(yAxisCategory => yAxisCategory.label)
    }

    _columnHeadersThatColumnGroupingFiltersSayWeCanInclude() {
        // In experiment heatmaps no Anatomical Systems filter are available, but they are built nonetheless and every
        // grouping filter is selected by default, so all columns are included
        const groupingFilterNames =
            this.props.groupingFilters
                .filter(filter => filter.valueGroupings.length > 0)
                .map(groupingFilter => groupingFilter.name);

        return this.props.selectedFilters
            .filter(selectedFilter => groupingFilterNames.includes(selectedFilter.name))
            .reduce((acc, selectedGroupingFilter) => [...acc, ...selectedGroupingFilter.valueNames], []);

    }

    _renderOrderings(heatmapDataToPresent) {
        return (
            this.props.heatmapConfig.isMultiExperiment ?
                <OrderingsDropdown orderings={Object.keys(this.props.orderings).map(
                    orderingKey => this.props.orderings[orderingKey].name)}
                                   selected={this.props.selectedOrderingName}
                                   onSelect={this.props.onSelectOrdering}
                                   zoom={this.props.zoom}
                                   hasLessThanTwoRows={heatmapDataToPresent.yAxisCategories.length < 2}
                />
                :
                null
        );
    }

    _renderFilters() {
        return (
            this.props.heatmapConfig.isMultiExperiment ?
                <FiltersModal filters={[this.props.expressionLevelFilters, ...this.props.groupingFilters]}
                              selectedFilters={this.props.selectedFilters}
                              onSelectFilters={this.props.onSelectFilters}
                              disabled={this.props.zoom}
                /> :
                null
        );
    }

    _renderDownloadButton(heatmapDataToPresent) {
        const downloadOptions = {
            download: {
                name: this.props.heatmapConfig.shortDescription || "download",
                descriptionLines:
                    [
                        this.props.heatmapConfig.description,
                        ...this.props.selectedOrderingName ? [`Ordering: ${this.props.selectedOrderingName}`] : [],
                        ...this.props.heatmapConfig.coexpressionsAvailable ?
                            [`Including ${this.props.coexpressionsShown} genes with similar expression pattern`] :
                            []
                    ],
                heatmapData: heatmapDataToPresent
            },
            disclaimer: this.props.heatmapConfig.disclaimer
        };

        return (
            <DownloadButton {...downloadOptions}/>
        )
    }

    render() {
        const anatomogramCallbacks = (heatmapDataToPresent, highlightOntologyIds) =>
            ({
                onUserSelectsRow: rowLabel => {
                    const y =
                        heatmapDataToPresent
                            .yAxisCategories
                            .findIndex(e => e.label === rowLabel);

                    highlightOntologyIds(
                        [].concat.apply([],
                            [].concat.apply([],
                                heatmapDataToPresent
                                    .dataSeries
                                    .map(series => series.data)
                            )
                                .filter(point => point.y === y)
                                .map(point => point.info.xId || heatmapDataToPresent.xAxisCategories[point.x].id)
                                .map(e => Array.isArray(e) ? e : [e])
                        )
                            .filter((e,ix,self) => self.indexOf(e) === ix)
                    )
                },

                onUserSelectsColumn: columnLabel => {
                    highlightOntologyIds(
                        heatmapDataToPresent
                            .xAxisCategories
                            .filter(e => e.label === columnLabel)
                            .map(e => e.id)
                            .concat([``])
                            [0]
                    )
                },

                onUserSelectsPoint: columnId => {
                    //Column ids are, in fact, factorValueOntologyTermId's
                    highlightOntologyIds(columnId || ``);
                }
            });

        const dummyAnatomogramCallbacks = {
            onUserSelectsRow: () => {
                console.log(`Anatomogram callback: Select row`)
            },
            onUserSelectsColumn: () => {
                console.log(`Anatomogram callback: Select column`)
            },
            onUserSelectsPoint: () => {
                console.log(`Anatomogram callback: Select point`)
            }
        };

        const heatmapDataToPresent = this._heatmapDataToPresent();
        const {yAxisStyle, yAxisFormatter, xAxisStyle, xAxisFormatter} = axesFormatters(this.props.heatmapConfig);

        const heatmapProps = {
            heatmapData: heatmapDataToPresent,
            colourAxis: this.props.colourAxis,
            cellTooltipFormatter: cellTooltipFormatter(this.props.heatmapConfig),
            yAxisStyle: yAxisStyle,
            yAxisFormatter: yAxisFormatter,
            xAxisStyle: xAxisStyle,
            xAxisFormatter: xAxisFormatter,
            onZoom: this.props.onZoom,
            genomeBrowserTemplate: this.props.heatmapConfig.genomeBrowserTemplate
            // TODO anatomogram callback to highlight column
        };

        return (
            <div>
                <div style={{float: `right`}}>
                    <div style={{display: `inline-block`, padding: `5px`}}>
                        {this._renderOrderings(heatmapDataToPresent)}
                    </div>
                    <div style={{display: `inline-block`, padding: `5px`}}>
                        {this._renderFilters()}
                    </div>
                    <div style={{display: `inline-block`, padding: `5px`}}>
                        {this._renderDownloadButton(heatmapDataToPresent)}
                    </div>
                </div>
                <div style={{clear: `both`}}>
                {heatmapProps.heatmapData.yAxisCategories < 1 ?
                    <div style={{padding: `50px 0`}}>No data match your filtering criteria or your original query. Please, change your query or your filters and try again.</div>
                    :
                    <div>
                        <div style={{padding: `10px 0`}}>
                            {this.props.heatmapConfig.introductoryMessage}
                        </div>
                        <HeatmapCanvas
                           onHoverColumn={dummyAnatomogramCallbacks.onUserSelectsColumn}
                           onHoverRow={dummyAnatomogramCallbacks.onUserSelectsRow}
                           onHoverPoint={dummyAnatomogramCallbacks.onUserSelectsPoint}
                           {...heatmapProps} />
                    </div>
                }
                <HeatmapLegend heatmapConfig={this.props.heatmapConfig}
                               dataSeries={this.props.heatmapData.dataSeries}
                               selectedExpressionLevelFilters={this._getSelectedExpressionLevelFilters()}
                               colourAxis={this.props.colourAxis}
                />

                {this.props.heatmapConfig.coexpressionsAvailable && !this.props.heatmapConfig.isWidget ?
                    <CoexpressionOption geneName={this.props.heatmapData.yAxisCategories[0].label}
                                        numCoexpressionsVisible={this.props.coexpressionsShown}
                                        numCoexpressionsAvailable={this.props.heatmapData.yAxisCategories.length - 1}
                                        showCoexpressionsCallback={e => this.props.onCoexpressionOptionChange(e)}
                    /> :
                    null
                }
                </div>
            </div>
        );
    }
}

HeatmapWithControls.propTypes = {
    heatmapConfig: heatmapConfigPropTypes.isRequired,
    heatmapData: heatmapDataPropTypes.isRequired,
    colourAxis: colourAxisPropTypes,    // Only available in experiment heatmap

    orderings: orderingsPropTypesValidator,
    selectedOrderingName: React.PropTypes.string.isRequired,
    onSelectOrdering: React.PropTypes.func.isRequired,

    expressionLevelFilters: filterPropTypes.isRequired,
    groupingFilters: React.PropTypes.arrayOf(filterPropTypes).isRequired,
    selectedFilters: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        valueNames: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    })).isRequired,
    onSelectFilters: React.PropTypes.func.isRequired,

    legendItems: React.PropTypes.arrayOf(React.PropTypes.shape({
        key: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        colour: React.PropTypes.string.isRequired,
        on: React.PropTypes.bool.isRequired
    })),

    dataSeriesLegendProps: React.PropTypes.arrayOf(React.PropTypes.shape({
        key: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        colour: React.PropTypes.string.isRequired,
        on: React.PropTypes.bool.isRequired
    })),

    gradientLegendProps: colourAxisPropTypes,

    coexpressionsShown: React.PropTypes.number,
    onCoexpressionOptionChange: React.PropTypes.func,

    zoom: React.PropTypes.bool.isRequired,
    onZoom: React.PropTypes.func,
    // ontologyIdsToHighlight: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    // onOntologyIdIsUnderFocus: React.PropTypes.func.isRequired,
};

export default HeatmapWithControls;
