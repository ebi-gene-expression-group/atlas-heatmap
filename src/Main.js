import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'

import URI from 'urijs'

import ContainerLoader from './layout/ContainerLoader.js'
import Container from './layout/Container.js'


/**
 * @param {Object}          options
 * @param {string | Object} options.target - a <div> id or a DOM element, as returned by ReactDOM.findDOMNode()
 * @param {boolean}         options.disableGoogleAnalytics - Disable Google Analytics
 * @param {function}        options.fail - Callback to run if the AJAX request to the server fails. (jqXHR, textStatus)
 * @param {function}        options.render - Callback to run after each render
 * @param {boolean}         options.showAnatomogram - optionally hide the anatomogram
 * @param {boolean}         options.isWidget
 * @param {string}          options.atlasUrl - Atlas host and path with protocol and port
 * @param {string}          options.inProxy - Inbound proxy to pull assets from outside your domain
 * @param {string}          options.outProxy - Outbound proxy for links that take you outside the current domain
 * @param {string}          options.experiment
 * @param {Object|string}   options.query - Query object or relative URL endpoint to source data from:
 *                              e.g. json/experiments/E-PROT-1, /json/genes/ENSG00000005801, /json/genesets/GO:0000001
 *                                   json/baseline_refexperiment?geneQuery=…, /json/baseline_experiments?geneQuery=…
 * @param {string}                              options.query.species
 * @param {{value: string, category: string}[]} options.query.gene
 * @param {{value: string, category: string}[]} options.query.condition
 * @param {string}                              options.query.source
 * @param {Object}          [unsupported] options.payload - optional, instead of query. It is left undocumented what this optional parameter could be, or when you would want to use it.

 */
const DEFAULT_OPTIONS = {
    showAnatomogram: true,
    isWidget: true,
    disableGoogleAnalytics: false,
    atlasUrl: `https://www.ebi.ac.uk/gxa/`,
    inProxy: ``,
    outProxy: ``,
    experiment: ``
}
const ExpressionAtlasHeatmap = options => (
    // The wrapping div is important to determine the width of the heatmap and know if the labels are going to be
    // rotated, so that we can set sensible margin sizes. See HeatmapCanvas.js
    <div className={`gxaHeatmapContainer`}>
    {
        options.payload
        ? <Container {...DEFAULT_OPTIONS} {...options} data={options.payload} />
        : <ContainerLoader
            {...DEFAULT_OPTIONS}
            {...options}
            source={
                typeof options.query == 'string'
                ? {
                    endpoint: options.query,
                    params: {}
                }
                : {
                    endpoint: resolveEndpoint(options.experiment),
                    //the webapp wants "geneQuery" and "conditionQuery" as parameters but in the API offering query.gene and query.condition felt nicer
                    params: Object.entries(options.query).map(p => ["gene", "condition"].includes(p[0]) ? [p[0]+"Query", p[1]]: p).reduce((acc,o)=>{ acc[o[0]]=o[1]; return acc}, {})
                }}
            render={fetchedData => (<Container {...DEFAULT_OPTIONS} {...options} data={fetchedData} />)}/>
    }
    </div>
)

const render = options => {
    const { disableGoogleAnalytics = false, render = () => {}, target } = options

    ReactDOM.render(
        <ExpressionAtlasHeatmap {...options} />,
        typeof target === `string` ? document.getElementById(target) : target,
        render)

    if (!disableGoogleAnalytics) {
      ReactGA.initialize(`UA-37676851-1`, {
          gaOptions: {
              name: 'atlas-highcharts-widget'
          }
      })
      ReactGA.pageview(window.location.pathname)
    }
}

function resolveEndpoint(experiment) {
    return (
        !experiment ?
            `json/baseline_experiments` :
            experiment === `reference` ?
                `json/baseline_refexperiment` :
                `json/experiments/${experiment}`
    )
}

export {ExpressionAtlasHeatmap as default, render}
