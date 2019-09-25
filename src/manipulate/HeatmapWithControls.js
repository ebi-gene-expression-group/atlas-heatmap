import React from 'react'
import PropTypes from 'prop-types'

import { uncontrollable } from 'uncontrollable'

import GenomeBrowsersDropdown from './controls/GenomeBrowsersDropdown.js'
import OrderingsDropdown from './controls/OrderingsDropdown.js'
import DownloadButton from './controls/download-button/DownloadButton.js'
import FiltersButton from './controls/filter/FiltersButton.js'

import cellTooltipFormatter from './formatters/heatmapCellTooltipFormatter.js'
import axesFormatters from './formatters/axesFormatters.js'

import {
  DataSeriesLegend as MultiExperimentLegend,
  GradientLegend as SingleExperimentLegend
} from './heatmap-legend/Main.js'

import CoexpressionOption from './coexpression/CoexpressionOption.js'

import makeEventCallbacks from './Events.js'

import {manipulate} from './Manipulators.js'

import debounceRender from 'react-debounce-render'
import _Anatomogram from 'anatomogram'
import _HeatmapCanvas from '../show/HeatmapCanvas.js'

const Anatomogram = debounceRender(_Anatomogram, 50)
const HeatmapCanvas = debounceRender(_HeatmapCanvas, 50)

import URI from 'urijs'

import {
  colourAxisPropTypes,
  columnGroupsPropTypes,
  groupedColumnPropTypes,
  heatmapConfigPropTypes,
  heatmapDataPropTypes,
  orderingPropTypes
} from '../manipulate/chartDataPropTypes.js'


const renderGenomeBrowsersDropdown = ({
  allGenomeBrowsers,
  currentGenomeBrowser,
  onChangeCurrentGenomeBrowser }) => (
  allGenomeBrowsers.length
    ?   <div style={{display: `inline-block`, padding: `5px`}}>
      <GenomeBrowsersDropdown
        genomeBrowsers={allGenomeBrowsers}
        selected={currentGenomeBrowser}
        onSelect={onChangeCurrentGenomeBrowser} />
    </div>
    : null
)

const renderOrderings = ({heatmapData,heatmapConfig,allOrderings,currentOrdering,onChangeCurrentOrdering, currentZoom}) => {
  const orderingCanChangeRowOrder = heatmapData.yAxisCategories.length > 1

  return (
    heatmapConfig.isMultiExperiment ?
      <div style={{display: `inline-block`, padding: `5px`}}>
        <OrderingsDropdown
          allOptions={allOrderings.map(o => o.name)}
          currentOption={currentOrdering.name}
          onChangeCurrentOption={(name) => onChangeCurrentOrdering(allOrderings.find(o => o.name === name))}
          title={currentZoom ? `Reset zoom to enable sorting options` : ``}
          disabled={currentZoom || ! orderingCanChangeRowOrder}
        />
      </div> :
      null
  )
}

const renderDownloadButton = ({
  heatmapConfig:{
    shortDescription,
    description,
    disclaimer,
    experiment,
    atlasUrl,
    outProxy
  },
  currentOrdering,
  allNumCoexpressions,
  currentNumCoexpressions,
  geneQueryIDList}
,heatmapData) => (
  <div style={{display: `inline-block`, padding: `5px`}}>
    <DownloadButton
      disclaimer={disclaimer}
      currentlyShownContent={{
        name: shortDescription || `download`,
        descriptionLines:
          description.concat(
            experiment ? [] : [`Ordering: ${currentOrdering.name}`],
            allNumCoexpressions && currentNumCoexpressions ? [`Including ${currentNumCoexpressions} genes with similar expression pattern`] : [],
            experiment ? [`Results as shown on page`] : []
          ),
        heatmapData
      }}
      fullDatasetUrl={
        experiment
          ? outProxy+URI(experiment.urls.download, atlasUrl).toString()
          : ``
      }
      geneQueryIDList= {geneQueryIDList} />
  </div>
)

const renderFiltersButton = ({
  heatmapConfig,
  columnGroups: {groupingNames, categories, categoryCheckboxes},
  currentZoom,
  allGroupedColumns,
  currentGroupedColumns,
  onChangeCurrentGroupedColumns
}) => (
  heatmapConfig.isMultiExperiment &&
  <div style={{display: `inline-block`, padding: `5px`}}>
    <FiltersButton
      categories={categories}
      categoryCheckboxes={categoryCheckboxes}
      allValues={allGroupedColumns}
      currentValues={currentGroupedColumns}
      disabled={currentZoom}
      onChangeCurrentValues={onChangeCurrentGroupedColumns}
      tabNames={groupingNames}
    />
  </div>
)

const renderCoexpressionOption = ({heatmapConfig,heatmapData,allNumCoexpressions,currentNumCoexpressions,onChangeCurrentNumCoexpressions}) => (
  heatmapConfig.coexpressionsAvailable && !heatmapConfig.isWidget ?
    <CoexpressionOption geneName={heatmapData.yAxisCategories[0].label}
      numCoexpressionsVisible={currentNumCoexpressions}
      numCoexpressionsAvailable={allNumCoexpressions}
      showCoexpressionsCallback={onChangeCurrentNumCoexpressions}
    /> :
    null
)

const renderGenomeBrowserHint = ({currentGenomeBrowser}) => (
  <p style={{clear: `both`, float: `right`, fontSize: `small`, margin: `0`, display:` block`}}>
    Click on a cell to open the selected genome browser with attached tracks if available
  </p>
)

const CanvasLegend = ({heatmapData,heatmapConfig,colourAxis,children}) => {
  return (
    heatmapConfig.isMultiExperiment ?
      <div>
        {
          children
        }
        <MultiExperimentLegend
          dataSeries={heatmapData.dataSeries}
        />
      </div> :
      <div>
        <SingleExperimentLegend
          heatmapConfig={heatmapConfig}
          colourAxis={colourAxis}
        />
        {
          children
        }
      </div>
  )
}
CanvasLegend.propTypes = {
  heatmapConfig: heatmapConfigPropTypes.isRequired,
  heatmapData: heatmapDataPropTypes.isRequired,
  colourAxis: colourAxisPropTypes
}

const heatmapExtraArgs = ({
  heatmapData,
  onOntologyIdIsUnderFocus,
  heatmapConfig,
  onChangeCurrentZoom,
  ontologyIdsToHighlight} ) => ({
  noDataCellsColour: heatmapConfig.isMultiExperiment ? `white` : `rgb(235, 235, 235)`,
  ontologyIdsToHighlight,
  onZoom:onChangeCurrentZoom,
  events:
    makeEventCallbacks({
      heatmapData: heatmapData,
      onSelectOntologyIds: onOntologyIdIsUnderFocus,
      heatmapConfig}),
  cellTooltipFormatter: cellTooltipFormatter(heatmapConfig),
  ...axesFormatters(heatmapConfig)
})

const heatmapDataToPresent = ({
  heatmapConfig,
  heatmapData,
  currentNumCoexpressions,
  currentGroupedColumns,
  currentOrdering}) => manipulate (
  {
    keepSeries: () => true,
    keepRow: heatmapConfig.coexpressionsAvailable
      ? rowHeader => (
        heatmapData.yAxisCategories
          .slice(0, currentNumCoexpressions + 1)
          .map(yAxisCategory => yAxisCategory.label)
          .includes(rowHeader.label)
      )
      : () => true,
    keepColumn:
      columnHeader => currentGroupedColumns.some(c => c.value === columnHeader.label),
    ordering: currentOrdering,
    allowEmptyColumns: Boolean(heatmapConfig.experiment)
  },
  heatmapData
)

const renderHeatmapCanvasWithSelectedDataSlice = (_args, heatmapDataToPresent, withAnatomogram) => {
  const args = {
    ..._args,
    heatmapData: heatmapDataToPresent
  }

  return (
    <CanvasLegend {...args}>
      <HeatmapCanvas
        {...heatmapExtraArgs(args)}
        heatmapData={heatmapDataToPresent}
        withAnatomogram={withAnatomogram}
        currentGenomeBrowser={_args.currentGenomeBrowser}/>
    </CanvasLegend>
  )
}

const renderAnatomogramControlsAndCanvas = (args, heatmapDataToPresent, anatomogramArgs) => (
  <div style={{clear: `both`, width: `100%`}}>
    <div style={{clear: `both`}}>
      <div style={{display: `inline-block`, width: `30%`}}>
        {args.heatmapConfig.introductoryMessage}
      </div>
      { args.heatmapConfig.showControlMenu && <div style={{display: `inline-block`, width: `70%`, textAlign: `right`}}>
        {renderGenomeBrowsersDropdown(args)}
        {renderOrderings(args)}
        {renderFiltersButton(args)}
        {renderDownloadButton(args,heatmapDataToPresent)}
      </div> }
    </div>
    {
      renderGenomeBrowserHint(args)
    }
    <div style={{clear: `both`}}>
      { !!anatomogramArgs &&
      <div style={{width: `17%`, marginRight: `3%`, display: `inline-block`, verticalAlign: `top`}}>
        <Anatomogram {...anatomogramArgs}/>
      </div> }

      <div style={{width: !anatomogramArgs ? `100%` : `80%`, display: `inline-block`, verticalAlign: `top`}}>
        { renderHeatmapCanvasWithSelectedDataSlice(args, heatmapDataToPresent, !!anatomogramArgs) }
        { renderCoexpressionOption(args) }
      </div>
    </div>
  </div>
)

class _HeatmapWithControls extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      highlightIds: [],
      highlightColumns: []
    }

    this.onOntologyIdIsUnderFocus = this._onOntologyIdIsUnderFocus.bind(this)
    this.onTissueIdIsUnderFocus = this._onTissueIdIsUnderFocus.bind(this)
    this.onTissueIdIsNotUnderFocus = this._onTissueIdIsNotUnderFocus.bind(this)
  }

  _onOntologyIdIsUnderFocus(ids) {
    this.setState({
      highlightIds: ids
    })
  }

  _onTissueIdIsUnderFocus(ids) {
    this.setState({
      highlightColumns: ids
    })
  }

  _onTissueIdIsNotUnderFocus() {
    this.setState({
      highlightColumns: []
    })
  }

  render() {
    const args = Object.assign({},
      this.state, this.props,
      {
        onOntologyIdIsUnderFocus: this.onOntologyIdIsUnderFocus,
        ontologyIdsToHighlight: this.state.highlightColumns
      })
    const heatmapData= heatmapDataToPresent(args)
    const anatomogramArgs = this.props.anatomogramConfig.show
      ? {
        atlasUrl: process.env.NODE_ENV === `development` ?
          `` :  // In development mode we load assets from Webpack’s output.publicPath
          this.props.anatomogramConfig.atlasUrl,
        species: this.props.anatomogramConfig.anatomogramData.species,
        showIds: heatmapData.xAxisCategories.map(e => e.id),
        highlightIds: heatmapData.xAxisCategories.map(e => e.id).filter(id => this.state.highlightIds.includes(id)),
        selectIds: [],
        onMouseOver: this.onTissueIdIsUnderFocus,
        onMouseOut: this.onTissueIdIsNotUnderFocus
      }
      : null
    return renderAnatomogramControlsAndCanvas(args, heatmapData, anatomogramArgs)
  }
}

_HeatmapWithControls.propTypes = {
  allGenomeBrowsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentGenomeBrowser: PropTypes.string.isRequired,
  onChangeCurrentGenomeBrowser: PropTypes.func.isRequired,
  allOrderings: PropTypes.arrayOf(orderingPropTypes),
  currentOrdering: orderingPropTypes,
  onChangeCurrentOrdering: PropTypes.func.isRequired,
  allGroupedColumns: PropTypes.arrayOf(groupedColumnPropTypes).isRequired,
  currentGroupedColumns: PropTypes.arrayOf(groupedColumnPropTypes).isRequired,
  onChangeCurrentGroupedColumns: PropTypes.func.isRequired,
  allNumCoexpressions: PropTypes.number.isRequired,
  currentNumCoexpressions: PropTypes.number.isRequired,
  onChangeCurrentNumCoexpressions: PropTypes.func.isRequired,
  currentZoom: PropTypes.bool.isRequired,
  onChangeCurrentZoom: PropTypes.func.isRequired,
  //and also props that aren't controls, in particular:
  heatmapConfig: heatmapConfigPropTypes.isRequired,
  heatmapData: heatmapDataPropTypes.isRequired,
  colourAxis: colourAxisPropTypes,    // Only available in experiment heatmap
  columnGroups: columnGroupsPropTypes,
}

const HeatmapWithControls = uncontrollable(_HeatmapWithControls, {
  currentGenomeBrowser: `onChangeCurrentGenomeBrowser`,
  currentOrdering: `onChangeCurrentOrdering`,
  currentGroupedColumns: `onChangeCurrentGroupedColumns`,
  currentNumCoexpressions: `onChangeCurrentNumCoexpressions`,
  currentZoom: `onChangeCurrentZoom`
})

const HeatmapWithControlsContainer = props => {
  const {heatmapData:{yAxisCategories}, orderings, heatmapConfig, columnGroups:{data:groupedColumns}} = props
  const defaultCurrentGenomeBrowser = Array.isArray(heatmapConfig.genomeBrowsers) ?
    heatmapConfig.genomeBrowsers[0].replace(/\s+/g, ``).toLowerCase() :
    ``
  return (
    <HeatmapWithControls
      {...props}
      allGenomeBrowsers={heatmapConfig.genomeBrowsers}
      allOrderings={orderings}
      allGroupedColumns={groupedColumns}
      allNumCoexpressions={heatmapConfig.coexpressionsAvailable ? yAxisCategories.length - 1 :0}
      defaultCurrentGenomeBrowser={defaultCurrentGenomeBrowser}
      defaultCurrentOrdering={orderings[0]}
      defaultCurrentGroupedColumns={groupedColumns}
      defaultCurrentNumCoexpressions={0}
      defaultCurrentZoom={false} />
  )
}

HeatmapWithControlsContainer.propTypes = {
  heatmapConfig: heatmapConfigPropTypes.isRequired,
  heatmapData: heatmapDataPropTypes.isRequired,
  orderings: PropTypes.arrayOf(orderingPropTypes)
}

export default HeatmapWithControlsContainer
