'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ontologyIdsForColumn = function _ontologyIdsForColumn(heatmapData, x) {
  return heatmapData.xAxisCategories[x].id;
};

var _ontologyIdsForRow = function _ontologyIdsForRow(heatmapData, y) {
  return [].concat.apply([], [].concat.apply([], heatmapData.dataSeries.map(function (series) {
    return series.data;
  })).filter(function (point) {
    return point.y === y && !!point.value;
  }).map(function (point) {
    return _ontologyIdsForColumn(heatmapData, point.x);
  }).map(function (e) {
    return Array.isArray(e) ? e : [e];
  })).filter(function (e, ix, self) {
    return self.indexOf(e) === ix;
  });
};

var makeEventCallbacks = function makeEventCallbacks(_ref) {
  var heatmapData = _ref.heatmapData,
      onSelectOntologyIds = _ref.onSelectOntologyIds,
      genomeBrowser = _ref.genomeBrowser,
      experimentAccession = _ref.experimentAccession,
      accessKey = _ref.accessKey,
      atlasUrl = _ref.atlasUrl;

  return {
    onHoverRow: function onHoverRow(y) {
      onSelectOntologyIds(_ontologyIdsForRow(heatmapData, y));
    },

    onHoverColumn: function onHoverColumn(x) {
      onSelectOntologyIds(_ontologyIdsForColumn(heatmapData, x));
    },

    onHoverOff: function onHoverOff() {
      onSelectOntologyIds([]);
    },

    /*
      For this to work genomeBrowser needs to be included in the props that cause a re-render in HeatmapCanvas.jsx
       TODO we have suffered a bit of a defeat here because it made us include accessKey.
      If instead of genomeBrowser string we had a {name, uri} here, we could do
      URI(genomeBrowser.uri, atlasUrl).search({
        experimentAccession: experimentAccession,
        geneId: heatmapData.xAxisCategories[x].info.trackId,
        trackId: heatmapData.yAxisCategories[y].info.trackId
      })
    */
    onClick: genomeBrowser !== 'none' ? function (x, y) {
      window.open((0, _urijs2.default)('external-services/genome-browser/' + genomeBrowser, atlasUrl).search({
        experimentAccession: experimentAccession,
        geneId: heatmapData.yAxisCategories[y].info.trackId,
        trackId: heatmapData.xAxisCategories[x].info.trackId,
        accessKey: accessKey
      }).toString(), '_blank');
    } : undefined
  };
};

var _default = makeEventCallbacks;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(_ontologyIdsForColumn, '_ontologyIdsForColumn', 'src/manipulate/Events.js');

  __REACT_HOT_LOADER__.register(_ontologyIdsForRow, '_ontologyIdsForRow', 'src/manipulate/Events.js');

  __REACT_HOT_LOADER__.register(makeEventCallbacks, 'makeEventCallbacks', 'src/manipulate/Events.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/Events.js');
}();

;