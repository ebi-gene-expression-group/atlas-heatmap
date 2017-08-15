import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'

import URI from 'urijs'

import ContainerLoader from './layout/ContainerLoader.js'

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

const ExpressionAtlasHeatmap = options => {
    const parsedQuery = parseQuery(options.query)
    const sourceUrl = typeof parsedQuery === `string` ? parsedQuery : URI(resolveEndpoint(options.experiment)).addSearch(parsedQuery)

    return (
        <ContainerLoader
            {...DEFAULT_OPTIONS}
            {...options}
            sourceUrl={sourceUrl.toString()} />
    )
}

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

function parseQuery(query) {
    if (!query) {
        return null
    }

    if (typeof query === `string`) {
        return query
    }

    return {
        geneQuery: stringifyIfNotString(query.gene),
        conditionQuery: stringifyIfNotString(query.condition),
        species: stringifyIfNotString(query.species),
        source: stringifyIfNotString(query.source)
    }
}

function stringifyIfNotString(o) {
    return typeof o === `string` ? o : JSON.stringify(o)
}


export {ExpressionAtlasHeatmap as default, render}
