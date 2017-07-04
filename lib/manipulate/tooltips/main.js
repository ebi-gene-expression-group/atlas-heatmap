'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // This module returns functions that take in labels of rows/columns and return content as it should appear in tooltip.


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FactorTooltip = require('./FactorTooltip.js');

var _FactorTooltip2 = _interopRequireDefault(_FactorTooltip);

var _ContrastTooltip = require('./ContrastTooltip.js');

var _ContrastTooltip2 = _interopRequireDefault(_ContrastTooltip);

var _GeneTooltip = require('./GeneTooltip.js');

var _GeneTooltip2 = _interopRequireDefault(_GeneTooltip);

require('./Tooltips.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createColumnLabelTooltipRenderer = function createColumnLabelTooltipRenderer(heatmapConfig, xAxisCategories) {
    if (!heatmapConfig.experiment) {
        return function () {
            return null;
        };
    }

    var tooltipDataPerHeader = {};
    for (var i = 0; i < xAxisCategories.length; i++) {
        if (xAxisCategories[i].info.tooltip) {
            tooltipDataPerHeader[xAxisCategories[i].label] = xAxisCategories[i].info.tooltip;
        }
    }
    Object.freeze(tooltipDataPerHeader);

    return function (columnIndex) {
        var columnHeader = xAxisCategories[columnIndex];
        return columnHeader && columnHeader.label && tooltipDataPerHeader.hasOwnProperty(columnHeader.label) ? heatmapConfig.isDifferential ? _react2.default.createElement(_ContrastTooltip2.default, tooltipDataPerHeader[columnHeader.label]) : _react2.default.createElement(_FactorTooltip2.default, tooltipDataPerHeader[columnHeader.label]) : null;
    };
};

var createRowLabelTooltipRenderer = function createRowLabelTooltipRenderer(heatmapConfig, yAxisCategories) {
    //We have the labels, but we need the identifiers to do lookups
    var rowHeaderPerLabel = {};
    for (var i = 0; i < yAxisCategories.length; i++) {
        rowHeaderPerLabel[yAxisCategories[i].label] = yAxisCategories[i];
    }
    Object.freeze(rowHeaderPerLabel);

    var resultCache = {};
    return function (rowIndex) {
        var rowHeader = yAxisCategories[rowIndex];
        if (rowHeader && rowHeader.label && rowHeaderPerLabel.hasOwnProperty(rowHeader.label)) {
            var bioentityIdentifier = rowHeaderPerLabel[rowHeader.label].id;
            var rowLabel = rowHeader.label;
            return _react2.default.createElement(_GeneTooltip2.default, _extends({ key: bioentityIdentifier,
                atlasBaseURL: heatmapConfig.atlasUrl,
                label: rowLabel,
                id: bioentityIdentifier,
                designElement: rowHeaderPerLabel[rowLabel].info.designElement || ""
            }, resultCache.hasOwnProperty(bioentityIdentifier) ? { data: resultCache[bioentityIdentifier] } : { onAjaxSuccessfulCacheResult: function onAjaxSuccessfulCacheResult(result) {
                    resultCache[bioentityIdentifier] = result;
                } }));
        } else {
            return null;
        }
    };
};

//TODO consider what the interface of this function should be.

var _default = function _default(heatmapConfig, xAxisCategories, yAxisCategories) {
    return {
        row: createRowLabelTooltipRenderer(heatmapConfig, yAxisCategories),
        column: createColumnLabelTooltipRenderer(heatmapConfig, xAxisCategories),
        point: function point() {}
    };
};

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(createColumnLabelTooltipRenderer, 'createColumnLabelTooltipRenderer', 'src/manipulate/tooltips/main.js');

    __REACT_HOT_LOADER__.register(createRowLabelTooltipRenderer, 'createRowLabelTooltipRenderer', 'src/manipulate/tooltips/main.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/tooltips/main.js');
}();

;