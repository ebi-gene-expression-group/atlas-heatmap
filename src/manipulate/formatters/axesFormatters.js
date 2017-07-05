import React from 'react'
import PropTypes from 'prop-types'
import ReactDOMServer from 'react-dom/server'

import escapedHtmlDecoder from 'he'
const reactToHtml = component => escapedHtmlDecoder.decode(ReactDOMServer.renderToStaticMarkup(component))

const YAxisLabel = (props) => {
    const geneNameWithLink =
        <a href={props.config.outProxy + props.url}>
            {props.labelText}
        </a>

    return (
        props.extra ?
            <span>{geneNameWithLink}<em style={{color:"black"}}>{`\t${props.extra}`}</em></span> :
            <span>{geneNameWithLink}</span>
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
      relUrl: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      species: PropTypes.string.isRequired
    })
  }).isRequired,
    labelText: PropTypes.string.isRequired,
    resourceId: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    extra: PropTypes.string
}

export default config => ({
    xAxisFormatter: value => value.label,
    xAxisStyle: {
        fontSize: config.isDifferential ? '9px': 'smaller',
        cursor: `default`,
        textOverflow: config.experiment ? `none` : `ellipsis`,
        whiteSpace: config.isDifferential ? `normal` : `nowrap`
    },

    yAxisFormatter: value => reactToHtml(
        <YAxisLabel config={config}
                    labelText={value.label}
                    resourceId={value.id}
                    url={value.info.url}
                    extra={value.info.designElement || ``}
        />
    ),
    yAxisStyle: {
        fontSize: config.isMultiExperiment ? 'smaller' : 'small',
        color: `#148ff3`
    }
})
