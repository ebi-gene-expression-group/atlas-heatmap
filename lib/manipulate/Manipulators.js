"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 All functions in this module accept and return a following format of data:
 {
     dataSeries : [info: {...: String}, data: [Point]}]
     xAxisCategories: [X axis label]
     yAxisCategories: [Y axis label]
 }
 */

var orderHeatmapData = function orderHeatmapData(ordering, data) {
    var permuteX = function permuteX(x) {
        return ordering.columns.indexOf(x);
    };
    var permuteY = function permuteY(y) {
        return ordering.rows.indexOf(y);
    };

    var permutePoint = function permutePoint(point) {
        return {
            x: permuteX(point.x),
            y: permuteY(point.y),
            value: point.value,
            info: point.info
        };
    };

    var permuteArray = function permuteArray(arr, permute) {
        return arr.map(function (el, ix) {
            return [el, permute(ix)];
        }).sort(function (l, r) {
            return l[1] - r[1];
        }).map(function (el) {
            return el[0];
        });
    };

    return {
        dataSeries: data.dataSeries.map(function (series) {
            return {
                info: series.info,
                data: series.data.map(permutePoint) };
        }),
        xAxisCategories: permuteArray(data.xAxisCategories, permuteX),
        yAxisCategories: permuteArray(data.yAxisCategories, permuteY)
    };
};

var _axisElementsForFilteredDataSeries = function _axisElementsForFilteredDataSeries(axis, conditionPerSeries, conditionPerPoint, dataSeries) {
    return dataSeries.filter(conditionPerSeries).map(function (e) {
        return e.data;
    }).reduce(function (l, r) {
        return l.concat(r);
    }, []).filter(conditionPerPoint).map(function (e) {
        return e[axis];
    }).filter(function (e, ix, self) {
        return self.indexOf(e) === ix;
    }) // unique
    .sort(function (l, r) {
        return l - r;
    });
};

var _filterHeatmapData = function _filterHeatmapData(keepSeries, keepPoint, data) {
    var allXs = _axisElementsForFilteredDataSeries("x", keepSeries, keepPoint, data.dataSeries);
    var allYs = _axisElementsForFilteredDataSeries("y", keepSeries, keepPoint, data.dataSeries);

    var newDataSeries = data.dataSeries.map(function (series, ix) {
        return keepSeries(series, ix) ? series.data.filter(keepPoint) : [];
    }).map(function (series) {
        return series.map(function (point) {
            return {
                x: allXs.indexOf(point.x),
                y: allYs.indexOf(point.y),
                value: point.value,
                info: point.info
            };
        }).filter(function (point) {
            return point.x > -1 && point.y > -1;
        });
    });

    return {
        dataSeries: data.dataSeries.map(function (e, ix) {
            return {
                info: e.info,
                data: newDataSeries[ix]
            };
        }),
        xAxisCategories: data.xAxisCategories.filter(function (e, ix) {
            return allXs.includes(ix);
        }),
        yAxisCategories: data.yAxisCategories.filter(function (e, ix) {
            return allYs.includes(ix);
        })
    };
};

var filterHeatmapData = function filterHeatmapData(keepSeries, keepRow, keepColumn, data) {
    return _filterHeatmapData(keepSeries, function (point) {
        return keepRow(data.yAxisCategories[point.y]) && keepColumn(data.xAxisCategories[point.x]);
    }, data);
};

var _calculateInserts = function _calculateInserts(fullColumns, originalColumns) {
    var result = [];
    var fullColumnsCursor = 0;
    var originalColumnsCursor = 0;

    while (fullColumnsCursor < fullColumns.length && originalColumnsCursor < originalColumns.length) {
        if (fullColumns.length > fullColumnsCursor && originalColumns.length > originalColumnsCursor && fullColumns[fullColumnsCursor] === originalColumns[originalColumnsCursor]) {
            result.push("");
            fullColumnsCursor++;
            originalColumnsCursor++;
        } else if (fullColumns.length > fullColumnsCursor) {
            result.push(fullColumns[fullColumnsCursor]);
            fullColumnsCursor++;
        } else if (originalColumns[originalColumnsCursor].length > originalColumnsCursor) {
            result.push("");
            originalColumnsCursor++;
        }
    }
    return result;
};

var _indicesForInserts = function _indicesForInserts(inserts) {
    var i = -1;
    return inserts.map(function (e) {
        !e && i++;
        return i;
    });
};

var insertEmptyColumns = function insertEmptyColumns(newColumns, data) {
    var fullColumns = newColumns.concat(data.xAxisCategories.filter(function (originalColumn) {
        return newColumns.findIndex(function (e) {
            return e.label === originalColumn.label;
        }) === -1;
    }));

    var insertIndices = _indicesForInserts(_calculateInserts(fullColumns.map(function (e) {
        return e.label;
    }), data.xAxisCategories.map(function (e) {
        return e.label;
    })));

    return {
        dataSeries: data.dataSeries.map(function (e) {
            return {
                info: e.info,
                data: e.data.map(function (point) {
                    return _extends({}, point, {
                        x: insertIndices.indexOf(point.x)
                    });
                })
            };
        }),
        xAxisCategories: fullColumns,
        yAxisCategories: data.yAxisCategories
    };
};

var manipulate = function manipulate(args, data) {
    var orderedHeatmapData = orderHeatmapData(args.ordering, data);
    return insertEmptyColumns(args.allowEmptyColumns ? orderedHeatmapData.xAxisCategories : [], filterHeatmapData(args.keepSeries, args.keepRow, args.keepColumn, orderedHeatmapData));
};

exports.insertEmptyColumns = insertEmptyColumns;
exports.filterHeatmapData = filterHeatmapData;
exports.orderHeatmapData = orderHeatmapData;
exports.manipulate = manipulate;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(orderHeatmapData, "orderHeatmapData", "src/manipulate/Manipulators.js");

    __REACT_HOT_LOADER__.register(_axisElementsForFilteredDataSeries, "_axisElementsForFilteredDataSeries", "src/manipulate/Manipulators.js");

    __REACT_HOT_LOADER__.register(_filterHeatmapData, "_filterHeatmapData", "src/manipulate/Manipulators.js");

    __REACT_HOT_LOADER__.register(filterHeatmapData, "filterHeatmapData", "src/manipulate/Manipulators.js");

    __REACT_HOT_LOADER__.register(_calculateInserts, "_calculateInserts", "src/manipulate/Manipulators.js");

    __REACT_HOT_LOADER__.register(_indicesForInserts, "_indicesForInserts", "src/manipulate/Manipulators.js");

    __REACT_HOT_LOADER__.register(insertEmptyColumns, "insertEmptyColumns", "src/manipulate/Manipulators.js");

    __REACT_HOT_LOADER__.register(manipulate, "manipulate", "src/manipulate/Manipulators.js");
}();

;