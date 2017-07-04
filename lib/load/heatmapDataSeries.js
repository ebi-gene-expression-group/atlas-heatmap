'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _experimentTypeUtils = require('./experimentTypeUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Returns an object with coordinates, expression value and other properties for each heat map cell
var buildHeatMapDataPointFromExpression = function buildHeatMapDataPointFromExpression(_ref) {
    var rowInfo = _ref.rowInfo,
        rowIndex = _ref.rowIndex,
        expression = _ref.expression,
        expressionIndex = _ref.expressionIndex;
    return expression.hasOwnProperty('value') ? {
        x: expressionIndex,
        y: rowIndex,
        value: expression.value,
        info: rowInfo
    } : expression.hasOwnProperty('foldChange') ? {
        x: expressionIndex,
        y: rowIndex,
        value: expression.foldChange,
        info: _extends({
            pValue: expression.pValue,
            foldChange: expression.foldChange,
            tStat: expression.tStat
        }, rowInfo)
    } : null;
};

var buildDataPointsFromRowExpressions = function buildDataPointsFromRowExpressions(_ref2) {
    var rowInfo = _ref2.rowInfo,
        expressions = _ref2.row.expressions,
        rowIndex = _ref2.rowIndex;
    return expressions.map(function (expression, expressionIndex) {
        return buildHeatMapDataPointFromExpression({ rowInfo: rowInfo, rowIndex: rowIndex, expression: expression, expressionIndex: expressionIndex });
    }).filter(function (el) {
        return el;
    });
};

// Returns lodash wrapper of an array with alternating entries of experiment type and an array of data points of that
// type
var _createDataPointsAndGroupThemByExperimentType = function _createDataPointsAndGroupThemByExperimentType(profilesRowsChain) {
    return profilesRowsChain.map(function (row, rowIndex) {
        return [row.experimentType, buildDataPointsFromRowExpressions({ rowInfo: { type: row.experimentType, description: row.name, unit: row.expressionUnit || "" /*no need for this safeguard after master from June 2017 is released*/ }, row: row, rowIndex: rowIndex })];
    }).groupBy(function (experimentTypeAndRow) {
        return experimentTypeAndRow[0];
    })
    // Just leave the data points...
    .mapValues(function (rows) {
        return rows.map(function (experimentTypeAndRow) {
            return experimentTypeAndRow[1];
        });
    })
    // Next, flatten all data point arrays into a single one for each experiment type:
    // {'rnaseq_mrna_baseline': [[v1],[v2,v3],[v4,v5,v6]]} => {'rnaseq_mrna_baseline': [[v1,v2,v3,v4,v5,v6]]}
    .mapValues(_lodash2.default.flatten)
    // Return an array of two-element arrays instead of array of objects:
    // {'rnaseq_mrna_baeline': [...], 'proteomics_baseline': [...]} =>
    //    [['rnaseq_mrna_baseline, [...]], ['proteomics_baseline', [...]]]
    .toPairs();
};

// Returns a function that, when passed an experimentType and an array of dataPoints, maps the array to pairs where the
// first element is the position in the thresholds array for that experiment type (e.g. 0, 1, 2, 3 for “Below cutoff”,
// “Low”, “Medium” and “High”, respectively) according to its value, and the second is the dataPoint itself
var dataPointsToThresholdCategoriesMapper = function dataPointsToThresholdCategoriesMapper(thresholds) {
    return function (experimentType, dataPoints) {
        return dataPoints.map(function (dataPoint) {
            return [_lodash2.default.sortedIndex(thresholds[experimentType] || thresholds.DEFAULT, dataPoint.value), dataPoint];
        });
    };
};

// Produces an array with as many thresholds/seriesNames/seriesColours each array entry contains an object with an
// info field (an object composed of the series/threshold name and colour) and a data array with the data points that
// correspond to that threshold
var experimentProfilesRowsAsDataPointsSplitByThresholds = function experimentProfilesRowsAsDataPointsSplitByThresholds(thresholds, seriesNames, seriesColours, profilesRows) {
    return _bucketsIntoSeries(seriesNames, seriesColours)(
    // Get lodash wrapper of the experiment type / data points array
    _createDataPointsAndGroupThemByExperimentType(_lodash2.default.chain(profilesRows))
    // Map arrays of exp. type and data points to arrays of [threshold group index, data point]
    .map(_lodash2.default.spread(dataPointsToThresholdCategoriesMapper(thresholds)))
    // After this flatten we have all the data points categorised by threshold in a single array... hooray!
    .flatten()).value();
};

// Create the array of pairs in a single experiment to be passed to _bucketsIntoSeries
var _splitDataSetByProportion = function _splitDataSetByProportion(data, names, colours) {
    var sortedValues = data.map(function (point) {
        return point.value;
    }).sort(function (l, r) {
        return l - r;
    });
    var howManyPointsInTotal = data.length;
    var howManyDataSetsToSplitIn = names.length;
    return _bucketsIntoSeries(names, colours)(_lodash2.default.chain(data).map(function (point) {
        return [Math.floor(_lodash2.default.sortedIndex(sortedValues, point.value) / howManyPointsInTotal * howManyDataSetsToSplitIn), point];
    })).value();
};

var splitGeneRowsIntoProportionalSeriesOfDataPoints = function splitGeneRowsIntoProportionalSeriesOfDataPoints(profilesRows, experiment, filters, names, colours) {
    var dataPoints = _lodash2.default.flatten(profilesRows.map(function (row, rowIndex) {
        return buildDataPointsFromRowExpressions({ rowInfo: { unit: row.expressionUnit || "" /*no need for this safeguard after master from June 2017 is released*/ }, row: row, rowIndex: rowIndex });
    }));

    return _lodash2.default.flatten(_lodash2.default.range(filters.length).map(function (i) {
        return _splitDataSetByProportion(dataPoints.filter(filters[i]), names[i], colours[i]);
    }));
};

// chain is a lodash wrapper of an array of pairs: [[0, dataPoint1], [0, dataPoint2], ... [3, dataPointN]]
// The first entry is the number of the category (i.e. “Below cutoff”, ”Low”...) and the second entry is the data point
// Returns an array
//    [{info: {...}, data:[data points of category 0]}, {info: {...}, data:[data points of category 1]}], etc.
var _bucketsIntoSeries = _lodash2.default.curry(function (seriesNames, seriesColours, pairsOfCategoryAndDataPointChain) {
    return pairsOfCategoryAndDataPointChain.groupBy(function (categoryAndDataPoint) {
        return categoryAndDataPoint[0];
    }).mapValues(function (pairs) {
        return pairs.map(function (categoryAndDataPoint) {
            return categoryAndDataPoint[1];
        });
    }).transform(function (result, bucketValues, bucketNumber) {
        result[bucketNumber].data = bucketValues;
    },
    // The empty with the series info but no data points
    _lodash2.default.range(seriesNames.length).map(function (i) {
        return {
            info: {
                name: seriesNames[i],
                colour: seriesColours[i]
            },
            data: []
        };
    }));
});

var getDataSeries = function getDataSeries(profilesRows, experiment) {
    var _fns = [_lodash2.default.lt, _lodash2.default.eq, _lodash2.default.gt].map(function (f) {
        return function (point) {
            return f(point.value, 0);
        };
    });
    var _belowCutoff = _fns[1];

    if ((0, _experimentTypeUtils.isDifferential)(experiment)) {
        return splitGeneRowsIntoProportionalSeriesOfDataPoints(profilesRows, experiment, _fns, [['High down', 'Down'], ['Below cutoff'], ['Up', 'High up']], [['#0000ff', '#8cc6ff'], ['gainsboro'], ['#e9967a', '#b22222']]);
    } else if ((0, _experimentTypeUtils.isBaseline)(experiment)) {
        return splitGeneRowsIntoProportionalSeriesOfDataPoints(profilesRows, experiment, [_belowCutoff, _lodash2.default.negate(_belowCutoff)], [['Below cutoff'], ['Low', 'Medium', 'High']], [['gainsboro'], ['#8cc6ff', '#0000ff', '#0000b3']]);
    } else if ((0, _experimentTypeUtils.isMultiExperiment)(experiment)) {
        return experimentProfilesRowsAsDataPointsSplitByThresholds({
            RNASEQ_MRNA_BASELINE: [0, 10, 1000],
            PROTEOMICS_BASELINE: [0, 0.001, 8],
            DEFAULT: [0, 10, 1000]
        }, ['Below cutoff', 'Low', 'Medium', 'High'], ['#eaeaea', '#45affd', '#1E74CA', '#024990'], profilesRows);
    } else {
        return null;
    }
};

var _default = getDataSeries;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(buildHeatMapDataPointFromExpression, 'buildHeatMapDataPointFromExpression', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(buildDataPointsFromRowExpressions, 'buildDataPointsFromRowExpressions', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(_createDataPointsAndGroupThemByExperimentType, '_createDataPointsAndGroupThemByExperimentType', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(dataPointsToThresholdCategoriesMapper, 'dataPointsToThresholdCategoriesMapper', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(experimentProfilesRowsAsDataPointsSplitByThresholds, 'experimentProfilesRowsAsDataPointsSplitByThresholds', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(_splitDataSetByProportion, '_splitDataSetByProportion', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(splitGeneRowsIntoProportionalSeriesOfDataPoints, 'splitGeneRowsIntoProportionalSeriesOfDataPoints', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(_bucketsIntoSeries, '_bucketsIntoSeries', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(getDataSeries, 'getDataSeries', 'src/load/heatmapDataSeries.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/load/heatmapDataSeries.js');
}();

;