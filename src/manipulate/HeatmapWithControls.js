import React from 'react'
import PropTypes from 'prop-types'

import Anatomogram from 'anatomogram'

import GenomeBrowsersDropdown from './controls/GenomeBrowsersDropdown.js'
import OrderingsDropdown from './controls/OrderingsDropdown.js'
import FiltersModal from './controls/filter/FiltersModal.js'
import DownloadButton from './controls/download-button/DownloadButton.js'

import HeatmapCanvas from '../show/HeatmapCanvas.js'

import cellTooltipFormatter from './formatters/heatmapCellTooltipFormatter.js'
import axesFormatters from './formatters/axesFormatters.js'

import {DataSeriesLegend as MultiExperimentLegend , GradientLegend as SingleExperimentLegend} from './heatmap-legend/Main.js'
import CoexpressionOption from './coexpression/CoexpressionOption.js'

import makeEventCallbacks from './Events.js'

import {manipulate} from './Manipulators.js'

import {spread, intersection} from 'lodash';

import {heatmapDataPropTypes, heatmapConfigPropTypes, orderingsPropTypesValidator, filterPropTypes, colourAxisPropTypes} from '../manipulate/chartDataPropTypes.js'

const renderGenomeBrowserSelect = ({
    heatmapConfig: {
        genomeBrowsers
    },
    selectedGenomeBrowser,
    onSelectGenomeBrowser }) => (
    genomeBrowsers.length
    ?   <div style={{display: `inline-block`, padding: `5px`}}>
            <GenomeBrowsersDropdown
                genomeBrowsers={genomeBrowsers}
                selected={selectedGenomeBrowser}
                onSelect={onSelectGenomeBrowser} />
        </div>
    : null
)

const renderOrderings = ({heatmapData,heatmapConfig,orderings,selectedOrderingName,onSelectOrdering, zoom}) => {
    return (
        heatmapConfig.isMultiExperiment ?
            <div style={{display: `inline-block`, padding: `5px`}}>
                <OrderingsDropdown
                    orderings=
                        {Object.keys(orderings)
                            .map(orderingKey => orderings[orderingKey].name)}
                    selected={selectedOrderingName}
                    onSelect={onSelectOrdering}
                    zoom={zoom}
                    hasLessThanTwoRows={heatmapData.yAxisCategories.length < 2}
                />
            </div> :
            null
    )
}

const renderDownloadButton = ({
    heatmapData,
    heatmapConfig:{
        shortDescription,
        description,
        coexpressionsAvailable,
        disclaimer
    },
    selectedOrderingName,
    coexpressionsShown}) => {
    const downloadOptions = {
        download: {
            name: shortDescription || "download",
            descriptionLines:
                [
                    description,
                    ...selectedOrderingName ? [`Ordering: ${selectedOrderingName}`] : [],
                    ...coexpressionsAvailable ?
                        [`Including ${coexpressionsShown} genes with similar expression pattern`] :
                        []
                ],
            heatmapData
        },
        disclaimer
    }

    return (
      <div style={{display: `inline-block`, padding: `5px`}}>
          <DownloadButton {...downloadOptions}/>
      </div>
    )
}


const HeatmapWithControls = ({
    chartData,
    coexpressionsShown,
    colourAxis,
    expressionLevelFilters,
    groupingFilters,
    heatmapConfig,
    heatmapData,
    onCoexpressionOptionChange,
    onOntologyIdIsUnderFocus,
    onSelectFilters,
    onSelectGenomeBrowser,
    onSelectOrdering,
    onZoom,
    ontologyIdsToHighlight,
    orderings,
    selectedColumnLabels,
    selectedFilters,
    selectedGenomeBrowser,
    selectedOrderingName,
    zoom}) => {
    //TODO achieve me with Object.assign on the previous props
    //const heatmapDataToPresent = this._heatmapDataToPresent()
    const {yAxisStyle, yAxisFormatter, xAxisStyle, xAxisFormatter} = axesFormatters(heatmapConfig)

    const heatmapProps = {
      heatmapData: heatmapData,
      colourAxis: colourAxis,
      cellTooltipFormatter: cellTooltipFormatter(heatmapConfig),
      yAxisStyle: yAxisStyle,
      yAxisFormatter: yAxisFormatter,
      xAxisStyle: xAxisStyle,
      xAxisFormatter: xAxisFormatter,
      onZoom: onZoom,
      ontologyIdsToHighlight: ontologyIdsToHighlight,
      events: makeEventCallbacks({
        heatmapData: heatmapData,
        onSelectOntologyIds: onOntologyIdIsUnderFocus,
        genomeBrowser: selectedGenomeBrowser,
        experimentAccession: heatmapConfig.experiment && heatmapConfig.experiment.accession,
        accessKey: heatmapConfig.experiment && heatmapConfig.experiment.accessKey,
        atlasUrl: heatmapConfig.atlasUrl
      })
    }

    return (
      <div>
        <div>
          <div style={{float: `left`, lineHeight: `2.5rem`, padding: `0.5rem 0`}}>
            {heatmapConfig.introductoryMessage}
          </div>
          <div style={{float: `right`, padding: `0.5rem 0`}}>
            {renderGenomeBrowserSelect({
                        heatmapConfig,
                        selectedGenomeBrowser,
                        onSelectGenomeBrowser})}
            {renderOrderings({
                        heatmapData,
                        heatmapConfig,
                        orderings,
                        selectedOrderingName,
                        onSelectOrdering,
                        zoom})}
            {false && this._renderFilters()}
            {renderDownloadButton({
                        heatmapData,
                        heatmapConfig,
                        selectedOrderingName,
                        coexpressionsShown})}
          </div>
          <p style={{clear: `both`, float: `right`, fontSize: `small`, margin: `0`,
                 visibility: selectedGenomeBrowser === `none` ? `hidden` : ` visible`}}>
            Click on a cell to open the selected genome browser with attached tracks if available
          </p>
        </div>
        <div style={{clear: `both`}}>
        {heatmapProps.heatmapData.yAxisCategories < 1 ?
          <div style={{padding: `50px 0`}}>
            No data match your filtering criteria or your original query. Please, change your query or your filters and try again.
          </div>
          :
          heatmapConfig.isMultiExperiment ?
            <div>
              <HeatmapCanvas {...heatmapProps}/>
              <MultiExperimentLegend
                dataSeries={heatmapData.dataSeries}
                selectedExpressionLevelFilters={[]}
              />
            </div> :
            <div>
              <SingleExperimentLegend
                heatmapConfig={heatmapConfig}
                colourAxis={colourAxis}
              />
              <HeatmapCanvas {...heatmapProps}/>
            </div>
        }

        {heatmapConfig.coexpressionsAvailable && !heatmapConfig.isWidget ?
          <CoexpressionOption geneName={heatmapData.yAxisCategories[0].label}
                    numCoexpressionsVisible={coexpressionsShown}
                    numCoexpressionsAvailable={heatmapData.yAxisCategories.length - 1}
                    showCoexpressionsCallback={e => onCoexpressionOptionChange(e)}
          /> :
          null
        }
        </div>
      </div>
    )
}

HeatmapWithControls.propTypes = {
    heatmapConfig: heatmapConfigPropTypes.isRequired,
    heatmapData: heatmapDataPropTypes.isRequired,
    colourAxis: colourAxisPropTypes,    // Only available in experiment heatmap

    orderings: orderingsPropTypesValidator,
    selectedOrderingName: PropTypes.string.isRequired,
    onSelectOrdering: PropTypes.func.isRequired,

    selectedColumnLabels: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onSelectColumnLabels: PropTypes.func.isRequired,

    selectedGenomeBrowser: PropTypes.string,
    onSelectGenomeBrowser: PropTypes.func,

    legendItems: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        colour: PropTypes.string.isRequired,
        on: PropTypes.bool.isRequired
    })),

    dataSeriesLegendProps: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        colour: PropTypes.string.isRequired,
        on: PropTypes.bool.isRequired
    })),

    gradientLegendProps: colourAxisPropTypes,

    coexpressionsShown: PropTypes.number,
    onCoexpressionOptionChange: PropTypes.func,

    zoom: PropTypes.bool.isRequired,
    onZoom: PropTypes.func,
    ontologyIdsToHighlight: PropTypes.arrayOf(PropTypes.string).isRequired,
    onOntologyIdIsUnderFocus: PropTypes.func.isRequired,
}

const heatmapDataToPresent = ({
    heatmapConfig,
    heatmapData,
    selectedColumnLabels,
    orderings,
    selectedOrderingName }) => manipulate (
    {
        //this.state.selectedHeatmapFilters
        //.find(selectedFilter => selectedFilter.name === this.props.chartData.expressionLevelFilters.name)
        //.valueNames
        keepSeries: series => true,//this.props.selectedFilters[0].valueNames.includes(series.info.name),
        keepRow: heatmapConfig.coexpressionsAvailable
            ? rowHeader => (
                heatmapData.yAxisCategories
                    .slice(0, coexpressionsShown + 1)
                    .map(yAxisCategory => yAxisCategory.label)
                    .includes(rowHeader.label)
            )
            : () => true,
        keepColumn:
            columnHeader => selectedColumnLabels.includes(columnHeader.label),
        ordering: orderings[
                Object.keys(orderings).find(
                    orderingKey => orderings[orderingKey].name === selectedOrderingName
                )],
        allowEmptyColumns: Boolean(heatmapConfig.experiment)
    },
    heatmapData
)

class HeatmapWithControlsAndAnatomogram extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      highlightIds: []
    }

    this._onOntologyIdIsUnderFocus = this._onOntologyIdIsUnderFocus.bind(this)
  }

  _onOntologyIdIsUnderFocus(id) {
    this.setState({
      highlightIds: id
    })
  }

  render() {
    const heatmapData = heatmapDataToPresent(this.props)

    const props = Object.assign({}, this.props, {heatmapData})

    // const Component =
    // this.props.anatomogramConfig.show
    //     ? Anatomogram.wrapComponent(
    //         Object.assign({}, this.props.anatomogramConfig,
    //         { idsExpressedInExperiment:
    //             heatmapData
    //             .xAxisCategories
    //             .map(e => e.id)
    //             .filter((e, ix, self) => self.indexOf(e) == ix)
    //         }),
    //         HeatmapWithControls, props
    //     ) : HeatmapWithControls
    return (
      <div className="row">
        {this.props.anatomogramConfig.show &&
        <div className="small-3 columns">
          <Anatomogram species={props.anatomogramConfig.anatomogramData.species}

                       showIds={props.anatomogramConfig.anatomogramData.allSvgPathIds}
                       highlightIds={this.state.highlightIds}
                       selectIds={[]}

                       showOpacity={0.3}
            // showColour=""
            // highlightColour=""
            // selectColour=""
            //
            // onMouseOver=""
            // onMouseOut=""
            // onClick=""
          />
        </div>}

        <div className={this.props.anatomogramConfig.show ? `small-9 columns` : `small-12 columns`}>
          <HeatmapWithControls {...props}
                               onOntologyIdIsUnderFocus={this._onOntologyIdIsUnderFocus} />
        </div>

      </div>
    )
  }
}

export default HeatmapWithControlsAndAnatomogram
