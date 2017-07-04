'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _experimentTypeUtils = require('./experimentTypeUtils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var highlightColour = function highlightColour(c) {
    return c.light() ? c.clone().lighten(0.5) : c.clone().saturate(0.3).darken(0.5);
};

var dataClassesFromSeries = function dataClassesFromSeries(dataSeries) {
    // No need to validate here, as it’s already been done in Container.jsx (cf. with previous version of ColorAxis.js)
    var xs = dataSeries.map(function (series) {
        return series.data.length === 0 && series.info.name === 'Below cutoff' ? {
            data: [{ value: 0.0 }],
            colour: series.info.colour
        } : {
            data: series.data,
            colour: series.info.colour
        };
    }).filter(function (series) {
        return series.data.length > 0;
    }).map(function (series, ix, self) {
        var theseSeriesValuesSorted = series.data.map(function (point) {
            return point.value;
        });
        theseSeriesValuesSorted.sort(function (l, r) {
            return l - r;
        });

        return {
            min: theseSeriesValuesSorted[0],
            minColour: ix === 0 ? highlightColour((0, _color2.default)(self[ix].colour)) : (0, _color2.default)(self[ix].colour).mix((0, _color2.default)(self[ix - 1].colour)),
            max: theseSeriesValuesSorted[theseSeriesValuesSorted.length - 1],
            maxColour: ix === self.length - 1 ? highlightColour((0, _color2.default)(self[ix].colour)) : (0, _color2.default)(self[ix].colour).mix((0, _color2.default)(self[ix + 1].colour)),
            median: theseSeriesValuesSorted[Math.floor(series.data.length / 2)],
            medianColour: (0, _color2.default)(self[ix].colour),
            sortedValues: theseSeriesValuesSorted
        };
    });

    var needToSplit = function needToSplit(x) {
        return x.sortedValues.length > 3 && x.sortedValues[0] !== x.sortedValues[x.sortedValues.length - 1] && x.minColour.rgbString() !== x.maxColour.rgbString();
    };

    var splitInHalf = function splitInHalf(x) {
        return [{
            min: x.min,
            minColour: x.minColour,
            max: x.median,
            maxColour: x.medianColour,
            median: x.sortedValues[Math.floor(x.sortedValues.length / 4)],
            medianColour: x.minColour.clone().mix(x.medianColour),
            sortedValues: x.sortedValues.slice(0, Math.floor(x.sortedValues.length / 2))
        }, {
            min: x.median,
            minColour: x.medianColour,
            max: x.max,
            maxColour: x.maxColour,
            median: x.sortedValues[Math.floor(3 * x.sortedValues.length / 4)],
            medianColour: x.medianColour.clone().mix(x.maxColour),
            sortedValues: x.sortedValues.slice(Math.floor(x.sortedValues.length / 2))
        }];
    };

    var l = Number.MIN_VALUE;
    var L = xs.length;
    while (l < L) {
        xs = [].concat.apply([], xs.map(function (x) {
            if (needToSplit(x)) {
                return splitInHalf(x);
            } else {
                return [x];
            }
        }));
        l = L;
        L = xs.length;
    }

    // The format of dataClasses is defined in http://api.highcharts.com/highmaps/colorAxis.dataClasses
    return xs.map(function (x) {
        return {
            from: x.min,
            to: x.max,
            color: x.medianColour.hexString()
        };
    });
};

var unitsUsedInDataSeries = function unitsUsedInDataSeries(dataSeries) {
    return [].concat.apply([], dataSeries.map(function (series) {
        return series.data;
    })).map(function (point) {
        return point.info.unit;
    }).filter(function (el) {
        return el;
    }).filter(function (el, ix, self) {
        return self.indexOf(el) === ix;
    }).join();
};

var getColourAxisFromDataSeries = function getColourAxisFromDataSeries(experiment, dataSeries) {
    return (0, _experimentTypeUtils.isMultiExperiment)(experiment) ? null : {
        dataClasses: dataClassesFromSeries(dataSeries),
        unit: unitsUsedInDataSeries(dataSeries)
    };
};

var _default = getColourAxisFromDataSeries;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(highlightColour, 'highlightColour', 'src/load/heatmapColourAxis.js');

    __REACT_HOT_LOADER__.register(dataClassesFromSeries, 'dataClassesFromSeries', 'src/load/heatmapColourAxis.js');

    __REACT_HOT_LOADER__.register(unitsUsedInDataSeries, 'unitsUsedInDataSeries', 'src/load/heatmapColourAxis.js');

    __REACT_HOT_LOADER__.register(getColourAxisFromDataSeries, 'getColourAxisFromDataSeries', 'src/load/heatmapColourAxis.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/load/heatmapColourAxis.js');
}();

;