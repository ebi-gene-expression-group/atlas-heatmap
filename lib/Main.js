'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactGa = require('react-ga');

var _reactGa2 = _interopRequireDefault(_reactGa);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _ContainerLoader = require('./layout/ContainerLoader.js');

var _ContainerLoader2 = _interopRequireDefault(_ContainerLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var DEFAULT_OPTIONS = {
    showAnatomogram: true,
    isWidget: true,
    disableGoogleAnalytics: false,
    atlasUrl: 'https://www.ebi.ac.uk/gxa/',
    inProxy: '',
    outProxy: '',
    experiment: ''
};

var ExpressionAtlasHeatmap = function ExpressionAtlasHeatmap(options) {
    var parsedQuery = parseQuery(options.query);
    var sourceUrl = typeof parsedQuery === 'string' ? parsedQuery : (0, _urijs2.default)(resolveEndpoint(options.experiment)).addSearch(parsedQuery);

    return _react2.default.createElement(_ContainerLoader2.default, _extends({}, DEFAULT_OPTIONS, options, {
        sourceUrl: sourceUrl.toString()
    }));
};

var render = function render(options) {
    var _options$disableGoogl = options.disableGoogleAnalytics,
        disableGoogleAnalytics = _options$disableGoogl === undefined ? false : _options$disableGoogl,
        _options$render = options.render,
        render = _options$render === undefined ? function () {} : _options$render,
        target = options.target;


    _reactDom2.default.render(_react2.default.createElement(ExpressionAtlasHeatmap, options), typeof target === 'string' ? document.getElementById(target) : target, render);

    if (!disableGoogleAnalytics) {
        _reactGa2.default.initialize('UA-37676851-1', {
            gaOptions: {
                name: 'atlas-highcharts-widget'
            }
        });
        _reactGa2.default.pageview(window.location.pathname);
    }
};

function resolveEndpoint(experiment) {
    return !experiment ? 'json/baseline_experiments' : experiment === 'reference' ? 'json/baseline_refexperiment' : 'json/experiments/' + experiment;
}

function parseQuery(query) {
    if (!query) {
        return null;
    }

    if (typeof query === 'string') {
        return query;
    }

    return {
        geneQuery: stringifyIfNotString(query.gene),
        conditionQuery: stringifyIfNotString(query.condition),
        species: stringifyIfNotString(query.species),
        source: stringifyIfNotString(query.source)
    };
}

function stringifyIfNotString(o) {
    return typeof o === 'string' ? o : JSON.stringify(o);
}

exports.default = ExpressionAtlasHeatmap;
exports.render = render;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(DEFAULT_OPTIONS, 'DEFAULT_OPTIONS', 'src/Main.js');

    __REACT_HOT_LOADER__.register(ExpressionAtlasHeatmap, 'ExpressionAtlasHeatmap', 'src/Main.js');

    __REACT_HOT_LOADER__.register(render, 'render', 'src/Main.js');

    __REACT_HOT_LOADER__.register(resolveEndpoint, 'resolveEndpoint', 'src/Main.js');

    __REACT_HOT_LOADER__.register(parseQuery, 'parseQuery', 'src/Main.js');

    __REACT_HOT_LOADER__.register(stringifyIfNotString, 'stringifyIfNotString', 'src/Main.js');
}();

;