'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../../utils.js');

require('./GradientHeatmapLegend.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderGradient = function renderGradient(_ref, index) {
    var fromValue = _ref.fromValue,
        toValue = _ref.toValue,
        colours = _ref.colours;

    var spanStyle = { backgroundImage: 'linear-gradient(to right, ' + colours.join(', ') + ')' };

    return fromValue < toValue ? _react2.default.createElement(
        'div',
        { style: { display: 'table-row' }, key: 'gradient_' + index },
        _react2.default.createElement(
            'div',
            { className: 'gxaGradientLevel gxaGradientLevelMin' },
            (0, _utils.numberWithCommas)(fromValue)
        ),
        _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', verticalAlign: 'middle' } },
            _react2.default.createElement('span', { className: 'gxaGradientColour', style: spanStyle })
        ),
        _react2.default.createElement(
            'div',
            { className: 'gxaGradientLevel gxaGradientLevelMax' },
            (0, _utils.numberWithCommas)(toValue)
        )
    ) : null;
};

var GradientHeatmapLegend = function GradientHeatmapLegend(_ref2) {
    var gradients = _ref2.gradients,
        unit = _ref2.unit;
    return _react2.default.createElement(
        'div',
        { className: 'gxaGradientLegend' },
        _react2.default.createElement(
            'div',
            null,
            !unit ? _react2.default.createElement(
                'span',
                null,
                'Expression level'
            ) : unit.indexOf("fold change") > -1 ? _react2.default.createElement(
                'span',
                null,
                'Log',
                _react2.default.createElement(
                    'sub',
                    null,
                    '2'
                ),
                '-fold change'
            ) : _react2.default.createElement(
                'span',
                null,
                'Expression level in ',
                unit
            )
        ),
        gradients.map(renderGradient)
    );
};

GradientHeatmapLegend.propTypes = {
    gradients: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        fromValue: _propTypes2.default.number,
        toValue: _propTypes2.default.number,
        colours: _propTypes2.default.arrayOf(_propTypes2.default.string)
    })).isRequired,
    unit: _propTypes2.default.string.isRequired
};

var _default = GradientHeatmapLegend;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(renderGradient, 'renderGradient', 'src/manipulate/heatmap-legend/GradientHeatmapLegend.js');

    __REACT_HOT_LOADER__.register(GradientHeatmapLegend, 'GradientHeatmapLegend', 'src/manipulate/heatmap-legend/GradientHeatmapLegend.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/heatmap-legend/GradientHeatmapLegend.js');
}();

;