import React from 'react'
import PropTypes from 'prop-types'

import ScientificNotationNumber from '@ebi-gene-expression-group/expression-atlas-number-format'

import trimEllipsify from './trimEllipsify'

const scientificNotation = value => <ScientificNotationNumber value={value} style={{fontWeight: `bold`}} />
const roundTStat = (n) => (n ? +n.toFixed(4) : ``)

const _tinySquare= (colour) => {
  return (
    <span key={`Tiny ${colour} square`}
      style={{
        border: `1px rgb(192, 192, 192) solid`,
        marginRight: `0.25rem`,
        width: `0.6rem`,
        height: `0.6rem`,
        display: `inline-block`,
        backgroundColor: colour
      }}
    />
  )
}

const _bold = (value) =>  <b>{value}</b>

const _elt = (E, name, value, format) => (
  Boolean(name && value) && <E key={`${name} ${value}`}>
    {typeof name === `string` ? `${name}: ` : name}
    {value.length > 50 && <br/>}
    {(format || _bold)(value)}
  </E>
)

const _div = _elt.bind(this, `div`)
const _span = _elt.bind(this, `span`)


const yInfo = ({config, yLabel}) => _div(config.yAxisLegendName, yLabel)

const xInfo = ({xAxisLegendName, config, xLabel}) => _div(xAxisLegendName || config.xAxisLegendName, xLabel)

const tooltipValueMaxLength = 30
const _comparisonDiv = (name, v1, v2, format) => {
  return (
    name && v1 && v2 ?
      <div key={`${name} ${v1} ${v2}`}>
        {`${name}: `}
        {v1.length + v2.length > tooltipValueMaxLength * 2 ? <br/> : null }
        {(format || _bold)(trimEllipsify(v1, tooltipValueMaxLength))}
        <i style={{margin: `0.25rem`}}>vs</i>
        {(format || _bold)(trimEllipsify(v2, tooltipValueMaxLength))}
      </div> :
      null
  )
}

const prettyName = (name) => (
  name
    .toLowerCase()
    .replace(/\w\S*/, (txt) => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
)

const xPropertiesBaselineList = ({xProperties}) => (
  xProperties
    .filter((property)=>(
      property.contrastPropertyType !== `SAMPLE` // would fail with showing too much stuff which isn't catastrophic
    ))
    .map((property)=>(
      _div(prettyName(property.propertyName), property.testValue)
    ))
)

const xPropertiesDifferentialList = ({xProperties}) => (
  xProperties
    .filter((property)=>(
      property.testValue !== property.referenceValue
    ))
    .map((property)=>(
      _comparisonDiv(
        prettyName(property.propertyName),
        property.testValue,
        property.referenceValue
      )
    ))
)

const differentialNumbers = ({colour, foldChange, pValue, tStat}) => (
  [
    <div key={``}>
      {_tinySquare(colour)}
      {_span(<span>Log<sub>2</sub>-fold change: </span>, foldChange)}
    </div>,
    _div(`Adjusted p-value`, pValue, scientificNotation),
    _div(`T-statistic`, roundTStat(tStat))
  ]
)

const baselineNumbers = ({colour, value, unit,replicates}) => (
  [
    _tinySquare(colour),
    _span(`Expression level`, value ?`${value} ${unit}` : `Below cutoff`)
  ].concat(replicates ? _div(`Number of biological replicates`, replicates) : [])
)

const HeatmapCellTooltip = (props) => (
  <div style={{
    whiteSpace: `pre`,background: `rgba(255, 255, 255, .85)`,
    padding: `5px`, border: `1px solid darkgray`,
    borderRadius: `3px`, boxShadow:`2px 2px 2px darkslategray`}}>
    {yInfo(props)}
    {props.config.isMultiExperiment
      ? xInfo(props)
      : props.config.isDifferential
        ? xPropertiesDifferentialList(props)
        : xPropertiesBaselineList(props)
    }
    {props.config.isDifferential
      ?
      differentialNumbers(props)
      :
      baselineNumbers(props)
    }
  </div>
)

HeatmapCellTooltip.propTypes = {
  config: PropTypes.shape({
    isDifferential: PropTypes.bool.isRequired,
    isMultiExperiment: PropTypes.bool.isRequired,
    xAxisLegendName: PropTypes.string.isRequired,
    yAxisLegendName: PropTypes.string.isRequired
  }).isRequired,
  colour: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  xProperties:
    PropTypes.arrayOf(
      PropTypes.shape({
        propertyName: PropTypes.string.isRequired,
        referenceValue: PropTypes.string, // present iff differential
        testValue: PropTypes.string.isRequired
      })),
  yLabel: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  replicates: PropTypes.number,
  foldChange: PropTypes.number,
  pValue: PropTypes.number,
  tStat: PropTypes.number,
  xAxisLegendName: PropTypes.string
}

export default HeatmapCellTooltip
