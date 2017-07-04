'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _HeatmapCellTooltip = require('./HeatmapCellTooltip.js');

var _HeatmapCellTooltip2 = _interopRequireDefault(_HeatmapCellTooltip);

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reactToHtml = function reactToHtml(component) {
    return _he2.default.decode(_server2.default.renderToStaticMarkup(component));
};

var _default = function _default(config) {
    return function (series, point) {
        var o = {
            colour: point.color,
            xLabel: point.options.info.xLabel || series.xAxis.categories[point.x].label,
            xProperties: series.xAxis.categories[point.x].info.tooltip.properties,
            yLabel: series.yAxis.categories[point.y].label,
            value: point.value,
            replicates: series.xAxis.categories[point.x].info.tooltip.replicates || undefined
        };

        Object.keys(point.options.info).forEach(function (key) {
            return o[key] = point.options.info[key];
        });

        return reactToHtml(_react2.default.createElement(_HeatmapCellTooltip2.default, _extends({}, o, { config: config })));
    };
};

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(reactToHtml, 'reactToHtml', 'src/manipulate/formatters/heatmapCellTooltipFormatter.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/formatters/heatmapCellTooltipFormatter.js');
}();

;