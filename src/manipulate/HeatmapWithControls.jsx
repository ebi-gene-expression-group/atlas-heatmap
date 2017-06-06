import React from 'react';

import GenomeBrowsersDropdown from './controls/GenomeBrowsersDropdown.jsx';
import OrderingsDropdown from './controls/OrderingsDropdown.jsx';
import FiltersModal from './controls/filter/FiltersModal.jsx';
import DownloadButton from './controls/download-button/DownloadButton.jsx';

import HeatmapCanvas from '../show/HeatmapCanvas.jsx';

import cellTooltipFormatter from './formatters/heatmapCellTooltipFormatter.jsx';
import axesFormatters from './formatters/axesFormatters.jsx';

import {DataSeriesLegend as MultiExperimentLegend , GradientLegend as SingleExperimentLegend} from './heatmap-legend/Main.jsx';
import CoexpressionOption from './coexpression/CoexpressionOption.jsx';

import makeEventCallbacks from './Events.js'

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
                <div style={{display: `inline-block`, padding: `5px`}}>
                    <OrderingsDropdown
                        orderings=
                            {Object.keys(this.props.orderings)
                                .map(orderingKey => this.props.orderings[orderingKey].name)}
                        selected={this.props.selectedOrderingName}
                        onSelect={this.props.onSelectOrdering}
                        zoom={this.props.zoom}
                        hasLessThanTwoRows={heatmapDataToPresent.yAxisCategories.length < 2}
                    />
                </div> :
                null
        );
    }

    _renderFilters() {
        return (
            this.props.heatmapConfig.isMultiExperiment ?
                <div style={{display: `inline-block`, padding: `5px`}}>
                    <FiltersModal filters={[this.props.expressionLevelFilters, ...this.props.groupingFilters]}
                                  selectedFilters={this.props.selectedFilters}
                                  onSelectFilters={this.props.onSelectFilters}
                                  disabled={this.props.zoom}
                    />
                </div> :
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
          <div style={{display: `inline-block`, padding: `5px`}}>
              <DownloadButton {...downloadOptions}/>
          </div>
        );
    }

    _renderGenomeBrowserSelect() {
        return (
        this.props.heatmapConfig.genomeBrowsers.length ?
            <div style={{display: `inline-block`, padding: `5px`}}>
                <GenomeBrowsersDropdown genomeBrowsers={this.props.heatmapConfig.genomeBrowsers}
                                        selected={this.props.selectedGenomeBrowser}
                                        onSelect={this.props.onSelectGenomeBrowser} />
            </div> :
            null
        );
    }

    render() {
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
            ontologyIdsToHighlight: this.props.ontologyIdsToHighlight,
            events: makeEventCallbacks({
              heatmapData: heatmapDataToPresent,
              onSelectOntologyIds: this.props.onOntologyIdIsUnderFocus,
              genomeBrowser: this.props.selectedGenomeBrowser,
              experimentAccession: this.props.heatmapConfig.experiment && this.props.heatmapConfig.experiment.accession,
              accessKey: this.props.heatmapConfig.experiment && this.props.heatmapConfig.experiment.accessKey,
              atlasUrl: this.props.heatmapConfig.atlasUrl
            })
        };

        const infoMessages = this.props.selectedGenomeBrowser === `none` ? [`hoo`] : [`Click on a cell to open the selected genome browser with attached tracks if available`];
      const info = infoMessages.map(item => <p key={item} style={{clear: `both`, float: `right`, fontSize: `small`, margin: `0`}}>{item}</p>);

        return (
            <div>
                <div>
                    <div style={{float: `left`, lineHeight: `2.5rem`, padding: `0.5rem 0`}}>
                        {this.props.heatmapConfig.introductoryMessage}
                    </div>
                    <div style={{float: `right`, padding: `0.5rem 0`}}>
                        {this._renderGenomeBrowserSelect()}
                        {this._renderOrderings(heatmapDataToPresent)}
                        {this._renderFilters()}
                        {this._renderDownloadButton(heatmapDataToPresent)}
                    </div>
                    <p style={{clear: `both`, float: `right`, fontSize: `small`, margin: `0`,
                               visibility: this.props.selectedGenomeBrowser === `none` ? `hidden` : ` visible`}}>
                      Click on a cell to open the selected genome browser with attached tracks if available
                    </p>
                </div>
                <div style={{clear: `both`}}>
                {heatmapProps.heatmapData.yAxisCategories < 1 ?
                    <div style={{padding: `50px 0`}}>
                      No data match your filtering criteria or your original query. Please, change your query or your filters and try again.
                    </div>
                    :
                    this.props.heatmapConfig.isMultiExperiment ?
                        <div>
                            <HeatmapCanvas {...heatmapProps}/>
                            <MultiExperimentLegend
                              dataSeries={this.props.heatmapData.dataSeries}
                              selectedExpressionLevelFilters={this._getSelectedExpressionLevelFilters()}
                            />
                        </div> :
                        <div>
                            <SingleExperimentLegend
                              heatmapConfig={this.props.heatmapConfig}
                              colourAxis={this.props.colourAxis}
                            />
                            <HeatmapCanvas {...heatmapProps}/>
                        </div>
                }

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

    selectedGenomeBrowser: React.PropTypes.string,
    onSelectGenomeBrowser: React.PropTypes.func,

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
    ontologyIdsToHighlight: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onOntologyIdIsUnderFocus: React.PropTypes.func.isRequired,
};

export default HeatmapWithControls;
