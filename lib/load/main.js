'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chartConfiguration = require('./chartConfiguration.js');

var _chartConfiguration2 = _interopRequireDefault(_chartConfiguration);

var _heatmapData = require('./heatmapData.js');

var _heatmapData2 = _interopRequireDefault(_heatmapData);

var _boxplotData = require('./boxplotData.js');

var _boxplotData2 = _interopRequireDefault(_boxplotData);

var _heatmapOrderings = require('./heatmapOrderings.js');

var _heatmapOrderings2 = _interopRequireDefault(_heatmapOrderings);

var _heatmapColourAxis = require('./heatmapColourAxis.js');

var _heatmapColourAxis2 = _interopRequireDefault(_heatmapColourAxis);

var _heatmapFilters = require('./heatmapFilters.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(data, inProxy, outProxy, atlasUrl, pathToResources, isWidget) {

    // This ensures that adding or removing coexpressed genes doesn’t change the colours in the heat map. Colours are
    // computed upfront and then we just add/remove rows with the coexpression slider.
    // coexpressions is an array because at first it was envisioned that the JSON payload could carry coexpressions of
    // more than one gene, but that’s not the case, and ended up being a single item array.
    var allRows = data.coexpressions ? data.profiles.rows.concat(data.coexpressions[0].jsonProfiles.rows) : data.profiles.rows;

    var heatmapData = (0, _heatmapData2.default)(allRows, data.config.geneQuery, data.columnHeaders, data.columnGroupings, data.experiment, inProxy, atlasUrl, pathToResources);

    return {
        heatmapData: heatmapData,
        boxplotData: (0, _boxplotData2.default)(data),
        heatmapConfig: (0, _chartConfiguration2.default)(data, inProxy, outProxy, atlasUrl, isWidget),
        colourAxis: (0, _heatmapColourAxis2.default)(data.experiment, heatmapData.dataSeries),
        orderings: (0, _heatmapOrderings2.default)(data.experiment, allRows, data.columnHeaders),
        expressionLevelFilters: (0, _heatmapFilters.getExpressionLevelFilters)(data.experiment, heatmapData.dataSeries),
        groupingFilters: (0, _heatmapFilters.getColumnGroupingFilters)(heatmapData.xAxisCategories)
    };
};

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/load/main.js');
}();

;