'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GradientLegend = exports.DataSeriesLegend = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DataSeriesHeatmapLegend = require('./DataSeriesHeatmapLegend.js');

var _DataSeriesHeatmapLegend2 = _interopRequireDefault(_DataSeriesHeatmapLegend);

var _GradientHeatmapLegend = require('./GradientHeatmapLegend.js');

var _GradientHeatmapLegend2 = _interopRequireDefault(_GradientHeatmapLegend);

var _chartDataPropTypes = require('../../manipulate/chartDataPropTypes.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DataSeriesLegend = function DataSeriesLegend(_ref) {
    var dataSeries = _ref.dataSeries,
        selectedExpressionLevelFilters = _ref.selectedExpressionLevelFilters;

    var legendItems = dataSeries.map(function (series) {
        return {
            key: series.info.name,
            name: series.info.name,
            colour: series.info.colour,
            on: selectedExpressionLevelFilters.includes(series.info.name)
        };
    });

    return _react2.default.createElement(_DataSeriesHeatmapLegend2.default, { legendItems: legendItems });
};

DataSeriesLegend.propTypes = {
    dataSeries: _chartDataPropTypes.dataSeriesPropTypes.isRequired,
    selectedExpressionLevelFilters: _propTypes2.default.array
};

var GradientLegend = function GradientLegend(_ref2) {
    var colourAxis = _ref2.colourAxis;

    var minDownRegulatedValue = Math.min.apply(Math, _toConsumableArray(colourAxis.dataClasses.filter(function (dataClass) {
        return dataClass.from <= 0;
    }).map(function (dataClass) {
        return dataClass.from;
    })));
    var maxDownRegulatedValue = Math.max.apply(Math, _toConsumableArray(colourAxis.dataClasses.filter(function (dataClass) {
        return dataClass.to <= 0;
    }).map(function (dataClass) {
        return dataClass.to;
    })));
    var downRegulatedColours = colourAxis.dataClasses.filter(function (dataClass) {
        return dataClass.from <= 0;
    }).map(function (dataClass) {
        return dataClass.color;
    });

    var minUpRegulatedValue = Math.min.apply(Math, _toConsumableArray(colourAxis.dataClasses.filter(function (dataClass) {
        return dataClass.from >= 0;
    }).map(function (dataClass) {
        return dataClass.from;
    })));
    var maxUpRegulatedValue = Math.max.apply(Math, _toConsumableArray(colourAxis.dataClasses.filter(function (dataClass) {
        return dataClass.to >= 0;
    }).map(function (dataClass) {
        return dataClass.to;
    })));
    var upRegulatedColours = colourAxis.dataClasses.filter(function (dataClass) {
        return dataClass.from >= 0;
    }).map(function (dataClass) {
        return dataClass.color;
    });

    return _react2.default.createElement(_GradientHeatmapLegend2.default, {
        gradients: [{
            fromValue: minDownRegulatedValue,
            toValue: maxDownRegulatedValue,
            colours: downRegulatedColours
        }, {
            fromValue: minUpRegulatedValue,
            toValue: maxUpRegulatedValue,
            colours: upRegulatedColours
        }],
        unit: colourAxis.unit
    });
};

GradientLegend.propTypes = {
    heatmapConfig: _chartDataPropTypes.heatmapConfigPropTypes.isRequired,
    colourAxis: _chartDataPropTypes.colourAxisPropTypes.isRequired
};

exports.DataSeriesLegend = DataSeriesLegend;
exports.GradientLegend = GradientLegend;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(DataSeriesLegend, 'DataSeriesLegend', 'src/manipulate/heatmap-legend/Main.js');

    __REACT_HOT_LOADER__.register(GradientLegend, 'GradientLegend', 'src/manipulate/heatmap-legend/Main.js');
}();

;