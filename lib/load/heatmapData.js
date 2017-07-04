'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _heatmapDataSeries = require('./heatmapDataSeries.js');

var _heatmapDataSeries2 = _interopRequireDefault(_heatmapDataSeries);

var _heatmapAxisCategories = require('./heatmapAxisCategories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(allRows, geneQuery, columnHeaders, columnGroupings, experiment, inProxy, atlasUrl, pathToResources) {
  return {
    xAxisCategories: (0, _heatmapAxisCategories.getHeatmapXAxisCategories)({ columnHeaders: columnHeaders, columnGroupings: columnGroupings, experiment: experiment, inProxy: inProxy, atlasUrl: atlasUrl, pathToResources: pathToResources }),
    yAxisCategories: (0, _heatmapAxisCategories.getHeatmapYAxisCategories)({ rows: allRows, geneQuery: geneQuery, experiment: experiment, inProxy: inProxy, atlasUrl: atlasUrl }),
    dataSeries: (0, _heatmapDataSeries2.default)(allRows, experiment)
  };
};

exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/load/heatmapData.js');
}();

;