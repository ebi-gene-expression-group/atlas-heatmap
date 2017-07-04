'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _anatomogram = require('anatomogram');

var _anatomogram2 = _interopRequireDefault(_anatomogram);

var _ExperimentDescription = require('./ExperimentDescription.js');

var _ExperimentDescription2 = _interopRequireDefault(_ExperimentDescription);

var _Footer = require('./Footer.js');

var _Footer2 = _interopRequireDefault(_Footer);

var _ChartContainer = require('../manipulate/ChartContainer.js');

var _ChartContainer2 = _interopRequireDefault(_ChartContainer);

var _jsonPayloadPropTypes = require('./jsonPayloadPropTypes.js');

var _jsonPayloadPropTypes2 = _interopRequireDefault(_jsonPayloadPropTypes);

var _main = require('../load/main.js');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChartWithAnatomogram = function ChartWithAnatomogram(_ref) {
    var data = _ref.data,
        inProxy = _ref.inProxy,
        outProxy = _ref.outProxy,
        atlasUrl = _ref.atlasUrl,
        showAnatomogram = _ref.showAnatomogram,
        isWidget = _ref.isWidget;
    var experiment = data.experiment,
        columnHeaders = data.columnHeaders,
        anatomogram = data.anatomogram;

    var pathToResources = inProxy + (0, _urijs2.default)('resources/js-bundles/', atlasUrl).toString();

    var chartData = (0, _main2.default)(data, inProxy, outProxy, atlasUrl, pathToResources, isWidget);

    if (anatomogram && showAnatomogram) {
        var Wrapped = _anatomogram2.default.wrapComponent({
            anatomogramData: anatomogram,
            pathToResources: inProxy + (0, _urijs2.default)('resources/js-bundles/', atlasUrl).toString(),
            expressedTissueColour: experiment ? 'gray' : 'red',
            hoveredTissueColour: experiment ? 'red' : 'purple',
            idsExpressedInExperiment: columnHeaders.map(function (header) {
                return header.factorValueOntologyTermId;
            })
        }, _ChartContainer2.default, { chartData: chartData });
        return _react2.default.createElement(Wrapped, null);
    } else {
        return _react2.default.createElement(_ChartContainer2.default, _extends({ chartData: chartData }, {
            ontologyIdsToHighlight: [],
            onOntologyIdIsUnderFocus: function onOntologyIdIsUnderFocus() {}
        }));
    }
};

ChartWithAnatomogram.propTypes = {
    inProxy: PropTypes.string.isRequired,
    outProxy: PropTypes.string.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    sourceUrl: PropTypes.string.isRequired,
    showAnatomogram: PropTypes.bool.isRequired,
    isWidget: PropTypes.bool.isRequired,
    data: _jsonPayloadPropTypes2.default.isRequired
};

var Container = function Container(props) {
    var data = props.data,
        inProxy = props.inProxy,
        outProxy = props.outProxy,
        atlasUrl = props.atlasUrl,
        showAnatomogram = props.showAnatomogram,
        isWidget = props.isWidget;
    var _data$config = data.config,
        geneQuery = _data$config.geneQuery,
        conditionQuery = _data$config.conditionQuery,
        species = _data$config.species;


    var moreInformationUrl = data.experiment ? // single experiment?
    (0, _urijs2.default)(data.experiment.relUrl, atlasUrl).search('') : (0, _urijs2.default)(atlasUrl).segment('query').search({ geneQuery: geneQuery, conditionQuery: conditionQuery, species: species });

    return _react2.default.createElement(
        'div',
        null,
        isWidget && data.experiment && _react2.default.createElement(_ExperimentDescription2.default, { outProxy: outProxy,
            experimentUrl: (0, _urijs2.default)(data.experiment.relUrl, atlasUrl).toString(),
            description: data.experiment.description }),
        _react2.default.createElement(ChartWithAnatomogram, props),
        isWidget && _react2.default.createElement(_Footer2.default, { outProxy: outProxy,
            atlasUrl: atlasUrl,
            moreInformationUrl: moreInformationUrl.toString() })
    );
};

Container.propTypes = ChartWithAnatomogram.propTypes;

var _default = Container;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(ChartWithAnatomogram, 'ChartWithAnatomogram', 'src/layout/Container.js');

    __REACT_HOT_LOADER__.register(Container, 'Container', 'src/layout/Container.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/layout/Container.js');
}();

;