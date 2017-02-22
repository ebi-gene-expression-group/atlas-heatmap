import React from 'react';
import ReactDOM from 'react-dom';
import URI from 'urijs';
import EventEmitter from 'events';
import ContainerLoader from './layout/ContainerLoader.jsx';

import oldRender from './highchartsHeatmapRenderer.js';

/**
 * @param {Object}          options
 * @param {string | Object} options.target - a <div> id or a DOM element, as returned by ReactDOM.findDOMNode()
 * @param {boolean=}        options.disableGoogleAnalytics - Disable Google Analytics
 * @param {function}        options.fail - Callback to run if the AJAX request to the server fails. (jqXHR, textStatus)
 * @param {Object}          options.anatomogramDataEventEmitter - emits events to the facets tree to signal the existence of anatomogram
 * @param {boolean=}        options.showAnatomogram - optionally hide the anatomogram
 * @param {boolean=}        options.isWidget
 *
 * @param {Object}          test - Use new way to build URL
 * @param {string=}         test.atlasUrl - Atlas host and path with protocol and port
 * @param {string}          test.inProxy - Inbound proxy to pull assets from outside your domain
 * @param {string}          test.outProxy - Outbound proxy for links that take you outside the current domain
 * @param {string}          test.experiment
 * @param {Object|string}   test.query - Query object or URL endpoint to source data from:
 *                              e.g. /json/experiments/E-PROT-1, /json/genes/ENSG00000005801, /json/genesets/GO:0000001
 *                                   /json/baseline_refexperiment?geneQuery=..., /json/baseline_experiments?geneQuery=...
 * @param {string}                              test.query.species
 * @param {{value: string, category: string}[]} test.query.gene
 * @param {{value: string, category: string}[]} test.query.condition
 */

export default function(options, test) {

    if (!test) {
        oldRender(options);
    }

    const { showAnatomogram = true, isWidget = true, disableGoogleAnalytics = false, fail, anatomogramDataEventEmitter,  target } = options;
    const { atlasUrl = `https://www.ebi.ac.uk/gxa/`, inProxy = ``, outProxy = ``, experiment = ``, query } = test;

    const inboundLinksUrl = new URI(inProxy + atlasUrl);
    const outboundLinksUrl = new URI(outProxy + atlasUrl);

    const sourceUrl = inboundLinksUrl.clone().segment(resolveEndpoint(experiment)).search(parseQuery(query));

    ReactDOM.render(
        <ContainerLoader sourceUrl={sourceUrl}
                         inboundLinksUrl={inboundLinksUrl}
                         outboundLinksUrl={outboundLinksUrl}
                         showAnatomogram={showAnatomogram}
                         isWidget={isWidget}
                         disableGoogleAnalytics={disableGoogleAnalytics}
                         fail={fail}
                         anatomogramEventEmitter={new EventEmitter().setMaxListeners(0)}
                         anatomogramDataEventEmitter={anatomogramDataEventEmitter} />,

        typeof target === `string` ? document.getElementById(target) : target
    );

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
    if (typeof query === `string`) {
        return query;
    }

    return {
        species: stringifyIfNotString(query.species),
        geneQuery: stringifyIfNotString(query.gene),
        conditionQuery: stringifyIfNotString(query.condition)
    }
}

function stringifyIfNotString(o) {
    return typeof o === `string` ? o : JSON.stringify(o);
}