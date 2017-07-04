'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _expressionAtlasNumberFormat = require('expression-atlas-number-format');

var _expressionAtlasNumberFormat2 = _interopRequireDefault(_expressionAtlasNumberFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scientificNotation = function scientificNotation(value) {
  return _expressionAtlasNumberFormat2.default.formatScientificNotation(value, 4, { fontWeight: 'bold' });
};

var roundTStat = function roundTStat(n) {
  return n ? +n.toFixed(4) : "";
};

var _tinySquare = function _tinySquare(colour) {
  return _react2.default.createElement('span', { key: 'Tiny ' + colour + ' square',
    style: {
      border: '1px rgb(192, 192, 192) solid',
      marginRight: '0.25rem',
      width: '0.6rem',
      height: '0.6rem',
      display: 'inline-block',
      backgroundColor: colour
    }
  });
};

var _info = function _info(text) {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'i',
      null,
      text
    )
  );
};

var _div = function _div(name, value, format) {
  return name && value ? _react2.default.createElement(
    'div',
    { key: name + ' ' + value },
    name,
    ": ",
    value.length > 50 ? _react2.default.createElement('br', null) : null,
    (format || _bold)(value)
  ) : null;
};

var _span = function _span(name, value) {
  return _react2.default.createElement(
    'span',
    { key: name + ' ' + value },
    name,
    ": ",
    value.length > 50 ? _react2.default.createElement('br', null) : null,
    _bold(value)
  );
};

var _bold = function _bold(value) {
  return _react2.default.createElement(
    'b',
    null,
    value
  );
};

var yInfo = function yInfo(_ref) {
  var config = _ref.config,
      yLabel = _ref.yLabel;
  return _div(config.yAxisLegendName, yLabel);
};

var xInfo = function xInfo(_ref2) {
  var xAxisLegendName = _ref2.xAxisLegendName,
      config = _ref2.config,
      xLabel = _ref2.xLabel;
  return _div(xAxisLegendName || config.xAxisLegendName, xLabel);
};

var _comparisonDiv = function _comparisonDiv(name, v1, v2, format) {
  return name && v1 && v2 ? _react2.default.createElement(
    'div',
    { key: name + ' ' + v1 + ' ' + v2 },
    name + ': ',
    v1.length + v2.length > 50 ? _react2.default.createElement('br', null) : null,
    (format || _bold)(v1),
    _react2.default.createElement(
      'i',
      { style: { margin: "0.25rem" } },
      'vs'
    ),
    (format || _bold)(v2)
  ) : null;
};

var prettyName = function prettyName(name) {
  return name.toLowerCase().replace(/\w\S*/, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

var xPropertiesBaselineList = function xPropertiesBaselineList(_ref3) {
  var xProperties = _ref3.xProperties;
  return xProperties.filter(function (property) {
    return property.contrastPropertyType !== "SAMPLE" // would fail with showing too much stuff which isn't catastrophic
    ;
  }).map(function (property) {
    return _div(prettyName(property.propertyName), property.testValue);
  });
};

var xPropertiesDifferentialList = function xPropertiesDifferentialList(_ref4) {
  var xProperties = _ref4.xProperties;
  return xProperties.filter(function (property) {
    return property.testValue !== property.referenceValue;
  }).map(function (property) {
    return _comparisonDiv(prettyName(property.propertyName), property.testValue, property.referenceValue);
  });
};

var differentialNumbers = function differentialNumbers(_ref5) {
  var colour = _ref5.colour,
      foldChange = _ref5.foldChange,
      pValue = _ref5.pValue,
      tStat = _ref5.tStat;
  return [_react2.default.createElement(
    'div',
    { key: '' },
    _tinySquare(colour),
    _span(_react2.default.createElement(
      'span',
      null,
      'Log',
      _react2.default.createElement(
        'sub',
        null,
        '2'
      ),
      '-fold change'
    ), foldChange)
  ), _div('Adjusted p-value', pValue, scientificNotation), _div('T-statistic', roundTStat(tStat))];
};

var baselineNumbers = function baselineNumbers(_ref6) {
  var colour = _ref6.colour,
      value = _ref6.value,
      unit = _ref6.unit,
      replicates = _ref6.replicates;
  return [_tinySquare(colour), _span('Expression level', value ? value + ' ' + unit : 'Below cutoff')].concat(replicates ? _div('Number of biological replicates', replicates) : []);
};

var HeatmapCellTooltip = function HeatmapCellTooltip(props) {
  return _react2.default.createElement(
    'div',
    { style: {
        whiteSpace: 'pre', background: 'rgba(255, 255, 255, .85)',
        padding: '5px', border: '1px solid darkgray',
        borderRadius: '3px', boxShadow: '2px 2px 2px darkslategray' } },
    yInfo(props),
    props.config.isMultiExperiment ? xInfo(props) : props.config.isDifferential ? xPropertiesDifferentialList(props) : xPropertiesBaselineList(props),
    props.config.isDifferential ? differentialNumbers(props) : baselineNumbers(props)
  );
};

HeatmapCellTooltip.propTypes = {
  config: _propTypes2.default.shape({
    isDifferential: _propTypes2.default.bool.isRequired,
    isMultiExperiment: _propTypes2.default.bool.isRequired,
    xAxisLegendName: _propTypes2.default.string.isRequired,
    yAxisLegendName: _propTypes2.default.string.isRequired
  }).isRequired,
  colour: _propTypes2.default.string.isRequired,
  xLabel: _propTypes2.default.string.isRequired,
  xProperties: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    propertyName: _propTypes2.default.string.isRequired,
    referenceValue: _propTypes2.default.string, // present iff differential
    testValue: _propTypes2.default.string.isRequired
  })),
  yLabel: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.number.isRequired,
  unit: _propTypes2.default.string.isRequired,
  replicates: _propTypes2.default.number,
  foldChange: _propTypes2.default.number,
  pValue: _propTypes2.default.number,
  tStat: _propTypes2.default.number,
  xAxisLegendName: _propTypes2.default.string
};

var _default = HeatmapCellTooltip;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(scientificNotation, 'scientificNotation', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(roundTStat, 'roundTStat', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(_tinySquare, '_tinySquare', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(_info, '_info', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(_div, '_div', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(_span, '_span', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(_bold, '_bold', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(yInfo, 'yInfo', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(xInfo, 'xInfo', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(_comparisonDiv, '_comparisonDiv', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(prettyName, 'prettyName', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(xPropertiesBaselineList, 'xPropertiesBaselineList', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(xPropertiesDifferentialList, 'xPropertiesDifferentialList', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(differentialNumbers, 'differentialNumbers', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(baselineNumbers, 'baselineNumbers', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(HeatmapCellTooltip, 'HeatmapCellTooltip', 'src/manipulate/formatters/HeatmapCellTooltip.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/formatters/HeatmapCellTooltip.js');
}();

;