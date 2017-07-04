'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _range2 = require('lodash/range');

var _range3 = _interopRequireDefault(_range2);

var _downloadjs = require('downloadjs');

var _downloadjs2 = _interopRequireDefault(_downloadjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var heatmapDataIntoLinesOfData = function heatmapDataIntoLinesOfData(heatmapData) {

    var heatmapDataAsMatrix = (0, _range3.default)(heatmapData.yAxisCategories.length).map(function (y) {
        return (0, _range3.default)(heatmapData.xAxisCategories.length).map(function (x) {
            return 'NA';
        });
    });

    heatmapData.dataSeries.forEach(function (series) {
        series.data.forEach(function (point) {
            heatmapDataAsMatrix[point.y][point.x] = point.value;
        });
    });

    return [[''].concat(heatmapData.xAxisCategories.map(function (header) {
        return header.label;
    }))].concat(heatmapData.yAxisCategories.map(function (rowLabel, ix) {
        return [].concat.apply([rowLabel.label], heatmapDataAsMatrix[ix]);
    })).map(function (line) {
        return line.join('\t');
    });
};

var CommenceDownload = function CommenceDownload(_ref) {
    var name = _ref.name,
        descriptionLines = _ref.descriptionLines,
        heatmapData = _ref.heatmapData;

    (0, _downloadjs2.default)(new Blob(['# Downloaded from: ' + window.location.href, '# Timestamp: ' + new Date().toISOString()].concat(_toConsumableArray(descriptionLines.map(function (line) {
        return '# ' + line;
    })), _toConsumableArray(heatmapDataIntoLinesOfData(heatmapData))).map(function (line) {
        return line + '\n';
    })), name.replace(/ +/, '_') + '.tsv', 'text/tsv');
};

var _default = CommenceDownload;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(heatmapDataIntoLinesOfData, 'heatmapDataIntoLinesOfData', 'src/manipulate/controls/download-button/Download.js');

    __REACT_HOT_LOADER__.register(CommenceDownload, 'CommenceDownload', 'src/manipulate/controls/download-button/Download.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/manipulate/controls/download-button/Download.js');
}();

;