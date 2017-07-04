'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./DataSeriesHeatmapLegend.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataSeriesHeatmapLegendBox = function DataSeriesHeatmapLegendBox(props) {
    return _react2.default.createElement(
        'div',
        { className: 'legend-item' + (props.on ? '' : ' legend-item-off') },
        _react2.default.createElement('div', { style: { background: props.colour }, className: 'legend-rectangle' }),
        _react2.default.createElement(
            'span',
            { style: { verticalAlign: 'middle' } },
            props.name
        )
    );
};

DataSeriesHeatmapLegendBox.propTypes = {
    name: _propTypes2.default.string.isRequired,
    colour: _propTypes2.default.string.isRequired,
    on: _propTypes2.default.bool.isRequired
};

var DataSeriesHeatmapLegend = function DataSeriesHeatmapLegend(props) {
    return _react2.default.createElement(
        'div',
        { className: 'gxaHeatmapLegend' },
        props.legendItems.map(function (legendItemProps) {
            return _react2.default.createElement(DataSeriesHeatmapLegendBox, legendItemProps);
        }),
        _react2.default.createElement(
            'div',
            { className: 'legend-item' },
            _react2.default.createElement('span', { className: 'icon icon-generic gxaInfoIcon',
                'data-icon': 'i', 'data-toggle': 'tooltip', 'data-placement': 'bottom',
                title: 'Baseline expression levels in RNA-seq experiments are in FPKM or TPM. Low: 0.5-10, Medium: 11-1,000,  High: >1,000. Proteomics expression levels are mapped to low, medium, high per experiment basis.' })
        ),
        _react2.default.createElement(DataSeriesHeatmapLegendBox, { key: 'No data available',
            name: 'No data available',
            colour: 'white',
            on: true
        })
    );
};

DataSeriesHeatmapLegend.propTypes = {
    legendItems: _propTypes2.default.arrayOf(_propTypes2.default.shape(DataSeriesHeatmapLegendBox.propTypes)).isRequired
};

var _default = DataSeriesHeatmapLegend;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(DataSeriesHeatmapLegendBox, 'DataSeriesHeatmapLegendBox', 'src/manipulate/heatmap-legend/DataSeriesHeatmapLegend.js');

    __REACT_HOT_LOADER__.register(DataSeriesHeatmapLegend, 'DataSeriesHeatmapLegend', 'src/manipulate/heatmap-legend/DataSeriesHeatmapLegend.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/heatmap-legend/DataSeriesHeatmapLegend.js');
}();

;