import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactDOMServer from 'react-dom/server'

import escapedHtmlDecoder from 'he'

import trimEllipsify from './trimEllipsify'

const reactToHtml = component => escapedHtmlDecoder.decode(ReactDOMServer.renderToStaticMarkup(component))

const ExperimentIconDiv = styled.div`
  background-color: ${props => props.background};
  color: ${props => props.color};
  border-radius: 50%;
  font-size: 16px;
  height: 20px;
  width: 20px;
  text-align: center;
  padding-top: 1px;
  vertical-align: middle;
  margin-right: 6px;
  opacity: 0.4;
  display: inline-block;
`

const YAxisLabel = (props) => {
  const experimentIcon = props.experimentType===`PROTEOMICS_BASELINE` || props.experimentType===`PROTEOMICS_BASELINE_DIA` ?
    <ExperimentIconDiv background={`green`} color={`white`} data-toggle={`tooltip`} data-placement={`bottom`}
      title={`Proteomics experiment`}>P</ExperimentIconDiv> :
    props.experimentType && <ExperimentIconDiv background={`orangered`} color={`white`} data-toggle={`tooltip`} data-placement={`bottom`}
      title={`Transcriptomics experiment`}>T</ExperimentIconDiv>
  const geneNameWithLink =
    <a href={props.config.outProxy + props.url} style={{border: `none`, color: `#148ff3`}}>
      {[experimentIcon, trimEllipsify(props.labelText, 40)]}
    </a>

  return (
    props.extra ?
      <span title={props.labelText.length > 40 ? props.labelText : ``}>
        {geneNameWithLink}<em style={{color:`black`}}>{`\t${props.extra}`}</em>
      </span> :
      <span title={props.labelText.length > 40 ? props.labelText : ``}>
        {geneNameWithLink}
      </span>
  )
}

YAxisLabel.propTypes = {
  config: PropTypes.shape({
    atlasUrl: PropTypes.string.isRequired,
    outProxy: PropTypes.string.isRequired,
    isMultiExperiment: PropTypes.bool.isRequired,
    isDifferential: PropTypes.bool.isRequired,
    experiment: PropTypes.shape({
      accession: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      species: PropTypes.string.isRequired
    })
  }).isRequired,
  labelText: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  extra: PropTypes.string,
  experimentType: PropTypes.string
}

export default config => ({
  xAxisFormatter: value => value.label,
  xAxisStyle: {
    fontSize: config.isDifferential ? `9px`: `smaller`,
    cursor: `default`,
    textOverflow: config.experiment ? `none` : `ellipsis`,
    whiteSpace: config.isDifferential ? `normal` : `nowrap`
  },

  yAxisFormatter: value => reactToHtml(
    <YAxisLabel config={config}
      labelText={value.label}
      resourceId={value.id}
      url={value.info.url}
      experimentType={value.info.experimentType}
      extra={value.info.designElement || ``}
    />
  ),
  yAxisStyle: {
    fontSize: config.isMultiExperiment ? `smaller` : `small`,
    color: `#148ff3`
  }
})
