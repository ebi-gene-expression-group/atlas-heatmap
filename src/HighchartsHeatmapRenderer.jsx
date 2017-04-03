import React from 'react';
import ReactDOM from 'react-dom';
import URI from 'urijs';

import ContainerLoader from './layout/ContainerLoader.jsx';

/**
 * @param {Object}          options
 * @param {string | Object} options.target - a <div> id or a DOM element, as returned by ReactDOM.findDOMNode()
 * @param {boolean}         options.disableGoogleAnalytics - Disable Google Analytics
 * @param {function}        options.fail - Callback to run if the AJAX request to the server fails. (jqXHR, textStatus)
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
 * @param {function}        options.onRender - Callback to run after each render
 */

export default function(options) {

    const { showAnatomogram = true, isWidget = true, disableGoogleAnalytics = false, fail, onRender = () => {}, target } = options;
    const { atlasUrl = `https://www.ebi.ac.uk/gxa/`, inProxy = ``, outProxy = ``, experiment = ``, query } = options;

    const parsedQuery = parseQuery(query);
    const sourceUrl = typeof parsedQuery === `string` ?
        parsedQuery : URI(resolveEndpoint(experiment)).search(parseQuery(query));

    ReactDOM.render(
        <ContainerLoader inProxy={inProxy}
                         outProxy={outProxy}
                         atlasUrl={atlasUrl}
                         sourceUrl={sourceUrl.toString()}
                         showAnatomogram={showAnatomogram}
                         isWidget={isWidget}
                         disableGoogleAnalytics={disableGoogleAnalytics}
                         fail={fail} />,

        typeof target === `string` ? document.getElementById(target) : target,

        onRender
    );

    if (!disableGoogleAnalytics) {
      googleAnalyticsCallback()
    }
};

function resolveEndpoint(experiment) {
    switch (experiment) {
        case ``:
            return `json/baseline_experiments`;
        case `reference`:
            return `json/baseline_refexperiment`;
        default:
            return `json/experiments/${experiment}`;
    }
}

function parseQuery(query) {
    if (!query) {
        return null;
    }

    if (typeof query === `string`) {
        return query;
    }

    return {
        geneQuery: stringifyIfNotString(query.gene),
        conditionQuery: stringifyIfNotString(query.condition),
        species: stringifyIfNotString(query.species)

    }
}

function stringifyIfNotString(o) {
    return typeof o === `string` ? o : JSON.stringify(o);
}

function googleAnalyticsCallback() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  window.ga('create', 'UA-37676851-1', 'auto', 'atlas-highcharts-widget');
  window.ga('atlas-highcharts-widget.send', 'pageview');
}
