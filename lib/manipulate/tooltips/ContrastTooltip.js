'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PropertyRow = function PropertyRow(props) {
  if (!props.testValue && !props.referenceValue) {
    return null;
  }

  var style = { whiteSpace: 'normal' };

  if (props.contrastPropertyType === 'FACTOR') {
    style.fontWeight = 'bold';
  } else {
    style.color = 'gray';
  }

  return _react2.default.createElement(
    'tr',
    { key: props.contrastPropertyType + '-' + props.propertyName },
    _react2.default.createElement(
      'td',
      { style: style },
      props.propertyName
    ),
    _react2.default.createElement(
      'td',
      { style: style },
      props.testValue
    ),
    _react2.default.createElement(
      'td',
      { style: style },
      props.referenceValue
    )
  );
};

var ContrastTooltipTable = function ContrastTooltipTable(props) {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { id: 'contrastExperimentDescription', style: { fontWeight: 'bold', color: 'blue', textAlign: 'center' } },
      props.experimentDescription
    ),
    _react2.default.createElement(
      'div',
      { id: 'contrastDescription', style: { textAlign: 'center' } },
      props.contrastDescription
    ),
    _react2.default.createElement(
      'table',
      { style: { padding: '0', margin: '0', width: '100%' } },
      _react2.default.createElement(
        'thead',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'th',
            null,
            'Property'
          ),
          _react2.default.createElement(
            'th',
            null,
            'Test value (N=',
            props.testReplicates,
            ')'
          ),
          _react2.default.createElement(
            'th',
            null,
            'Reference value (N=',
            props.referenceReplicates,
            ')'
          )
        )
      ),
      _react2.default.createElement(
        'tbody',
        null,
        props.properties.map(function (property) {
          return _react2.default.createElement(PropertyRow, property);
        })
      )
    )
  );
};

ContrastTooltipTable.propTypes = {
  experimentDescription: _propTypes2.default.string.isRequired,
  contrastDescription: _propTypes2.default.string.isRequired,
  testReplicates: _propTypes2.default.number.isRequired,
  referenceReplicates: _propTypes2.default.number.isRequired,
  properties: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    contrastPropertyType: _propTypes2.default.string,
    propertyName: _propTypes2.default.string.isRequired,
    referenceValue: _propTypes2.default.string.isRequired,
    testValue: _propTypes2.default.string.isRequired
  }))
};

var ContrastTooltip = function ContrastTooltip(props) {
  var descriptions = {
    "gsea_go": 'Click to view GO terms enrichment analysis plot',
    "gsea_interpro": 'Click to view Interpro domains enrichment analysis plot',
    "gsea_reactome": 'Click to view Reactome pathways enrichment analysis plot',
    "ma-plot": 'Click to view MA plot for the contrast across all genes'
  };

  return _react2.default.createElement(
    'div',
    { className: 'gxaContrastTooltip' },
    _react2.default.createElement(ContrastTooltipTable, props),
    _react2.default.createElement(
      'div',
      { className: 'contrastPlots' },
      _react2.default.createElement(
        'span',
        null,
        undefined.props.resources.length && _react2.default.createElement(
          'span',
          null,
          ' Available plots: '
        ),
        undefined.props.resources.map(function (resource) {
          return _react2.default.createElement(
            'a',
            { href: resource.url, key: resource.type, title: descriptions[resource.type],
              style: { textDecoration: 'none' }, target: '_blank' },
            _react2.default.createElement('img', { src: resource.icon })
          );
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'info' },
        ' Click label to interact with tooltip'
      )
    )
  );
};

ContrastTooltip.propTypes = _extends({
  resources: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    type: _propTypes2.default.oneOf(['gsea_go', 'gsea_interpro', 'gsea_reactome', 'ma-plot']).isRequired,
    url: _propTypes2.default.string.isRequired
  })).isRequired
}, ContrastTooltipTable.propTypes);

var _default = ContrastTooltip;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(PropertyRow, 'PropertyRow', 'src/manipulate/tooltips/ContrastTooltip.js');

  __REACT_HOT_LOADER__.register(ContrastTooltipTable, 'ContrastTooltipTable', 'src/manipulate/tooltips/ContrastTooltip.js');

  __REACT_HOT_LOADER__.register(ContrastTooltip, 'ContrastTooltip', 'src/manipulate/tooltips/ContrastTooltip.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/tooltips/ContrastTooltip.js');
}();

;