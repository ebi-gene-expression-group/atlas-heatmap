'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getColumnGroupingFilters = exports.getExpressionLevelFilters = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getExpressionLevelFilters = function getExpressionLevelFilters(experiment, dataSeries) {
    return {
        name: 'Expression value' + (experiment ? ' \u2013 relative' : ''),
        values: dataSeries.map(function (series) {
            return {
                name: series.info.name,
                disabled: series.data.length === 0
            };
        })
    };
};

var getColumnGroupingFilters = function getColumnGroupingFilters(xAxisCategories) {
    var groupingTriplets = _lodash2.default.flattenDeep(xAxisCategories.reduce(function (acc, columnHeader) {
        var _groupingTriplets = columnHeader.info.groupings.map(function (grouping) {
            return grouping.values.map(function (groupingValue) {
                return {
                    name: grouping.name,
                    groupingLabel: groupingValue.label,
                    columnLabel: columnHeader.label
                };
            });
        });
        acc.push(_groupingTriplets);

        return acc;
    }, []));

    var groupingNames = _lodash2.default.uniq(groupingTriplets.map(function (groupingTriplet) {
        return groupingTriplet.name;
    }));

    return groupingNames.map(function (groupingName) {
        var columnLabels = _lodash2.default.uniq(groupingTriplets.filter(function (groupingTriplet) {
            return groupingTriplet.name === groupingName;
        }).map(function (groupingTriplet) {
            return groupingTriplet.columnLabel;
        }));

        var groupingLabels = _lodash2.default.uniq(groupingTriplets.filter(function (groupingTriplet) {
            return groupingTriplet.name === groupingName;
        }).map(function (groupingTriplet) {
            return groupingTriplet.groupingLabel;
        })).sort();

        var groupingLabelsWithUnmappedLast = groupingLabels.filter(function (l) {
            return l !== 'Unmapped';
        }).concat(groupingLabels.find(function (l) {
            return l === 'Unmapped';
        }) || []);

        return {
            name: groupingName,
            values: columnLabels.map(function (label) {
                return {
                    name: label,
                    disabled: false // Guaranteed because values are extracted from xAxisCategories
                };
            }),
            valueGroupings: groupingLabelsWithUnmappedLast.map(function (groupingLabel) {
                return [groupingLabel, _lodash2.default.sortedUniq(groupingTriplets.filter(function (groupingTriplet) {
                    return groupingTriplet.name === groupingName && groupingTriplet.groupingLabel === groupingLabel;
                }).map(function (groupingTriplet) {
                    return groupingTriplet.columnLabel;
                }))];
            })
        };
    });
};

exports.getExpressionLevelFilters = getExpressionLevelFilters;
exports.getColumnGroupingFilters = getColumnGroupingFilters;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(getExpressionLevelFilters, 'getExpressionLevelFilters', 'src/load/heatmapFilters.js');

    __REACT_HOT_LOADER__.register(getColumnGroupingFilters, 'getColumnGroupingFilters', 'src/load/heatmapFilters.js');
}();

;