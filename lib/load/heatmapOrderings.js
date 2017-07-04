'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _experimentTypeUtils = require('./experimentTypeUtils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//apply rank first, use comparator to resolve ties
var createOrdering = function createOrdering(rank, comparator, arr) {
    return arr.map(function (e, ix) {
        return [e, ix];
    })
    //lower ranks go to the beginning of series
    .sort(function (e_ixLeft, e_ixRight) {
        return rank[e_ixLeft[1]] - rank[e_ixRight[1]] || comparator(e_ixLeft[0], e_ixRight[0]);
    }).map(function (e_ix) {
        return e_ix[1];
    });
};

var createAlphabeticalOrdering = function createAlphabeticalOrdering(property, arr) {
    return createOrdering(arr.map(_lodash2.default.constant(0)), comparatorByProperty(property), arr);
};

var comparatorByProperty = _lodash2.default.curry(function (property, e1, e2) {
    return e1[property].localeCompare(e2[property]);
});

var rankColumnsByWhereTheyAppearFirst = function rankColumnsByWhereTheyAppearFirst(expressions) {
    return _lodash2.default.chain(expressions).map(function (row) {
        return row.map(function (e) {
            return +e.hasOwnProperty('value');
        });
    }).thru(_lodash2.default.spread(_lodash2.default.zip)).map(function (column) {
        return column.map(function (e, ix) {
            return e * (ix + 1);
        }).filter(_lodash2.default.identity);
    }).map(_lodash2.default.min).value();
};

var highestColumnRankPossible = function highestColumnRankPossible(expressions) {
    return expressions.length ? expressions[0].length : Number.MAX_VALUE;
};

var thresholdColumnsByExpressionAboveCutoff = function thresholdColumnsByExpressionAboveCutoff(expressions) {
    return rankColumnsByExpression(expressions, 0)
    //check if the function assigned the rank value corresponding to everything filtered off
    .map(function (e) {
        return e === highestColumnRankPossible(expressions) ? 1 : 0;
    });
};

var rankColumnsByExpression = function rankColumnsByExpression(expressions, minimalExpression) {
    var includeInRanking = typeof minimalExpression === 'number' ? function (e) {
        return e.hasOwnProperty('value') && !isNaN(e.value) && Math.abs(e.value) > minimalExpression;
    } : function (e) {
        return e.hasOwnProperty('value') && !isNaN(e.value);
    };

    return _lodash2.default.chain(expressions).map(function (row) {
        var valuesInRow = _lodash2.default.uniq(row.filter(includeInRanking).map(function (e) {
            return e.value;
        }).sort(function (l, r) {
            return r - l;
        }));

        return row.map(function (e) {
            return includeInRanking(e) ? valuesInRow.indexOf(e.value) : 'missing';
        });
    }).thru(_lodash2.default.spread(_lodash2.default.zip)).map(function (ranks) {
        return ranks.filter(_lodash2.default.negate(isNaN));
    }).map(function (ranks) {
        return ranks.length ? _lodash2.default.sum(ranks) / ranks.length : highestColumnRankPossible(expressions);
    }).value();
};

var rankColumnsByThreshold = function rankColumnsByThreshold(threshold, expressions) {
    return expressions.map(function (row) {
        return row.map(function (point) {
            return +(point.hasOwnProperty('value') && point.value !== 0);
        });
    }).reduce(function (r1, r2) {
        return r1.map(function (el, ix) {
            return el + r2[ix];
        }, _lodash2.default.fill(Array(expressions.length ? expressions[0].length : 0), 0));
    }).map(function (countOfExperimentsWhereTissueExpressedAboveCutoff) {
        return countOfExperimentsWhereTissueExpressedAboveCutoff > expressions.length * threshold ? 0 : 1;
    });
};

var noOrdering = function noOrdering(arr) {
    return arr.map(function (el, ix) {
        return ix;
    });
};

var combineRanks = function combineRanks(ranksAndWeights) {
    return _lodash2.default.chain(ranksAndWeights).map(function (rankAndWeight) {
        return rankAndWeight[0].map(function (rank) {
            return rank * rankAndWeight[1];
        });
    }).thru(_lodash2.default.spread(_lodash2.default.zip)).map(_lodash2.default.sum).value();
};

var createOrderings = function createOrderings(expressions, columnHeaders, rows, experiment) {
    var transposed = _lodash2.default.zip.apply(_lodash2.default, expressions);

    if ((0, _experimentTypeUtils.isMultiExperiment)(experiment)) {
        return {
            default: {
                name: 'By experiment type',
                columns: createAlphabeticalOrdering('factorValue', columnHeaders),
                rows: noOrdering(rows)
            },
            alphabetical: {
                name: 'Alphabetical order',
                columns: createAlphabeticalOrdering('factorValue', columnHeaders),
                rows: createAlphabeticalOrdering('name', rows)
            },
            geneExpression: {
                name: 'Gene expression rank',
                columns: createOrdering(combineRanks([[rankColumnsByWhereTheyAppearFirst(expressions), 1], [rankColumnsByExpression(expressions), 1e3], [rankColumnsByThreshold(0.05 + 0.4 / Math.pow(1 + transposed.length / 8, 0.4), expressions), 1e6], [thresholdColumnsByExpressionAboveCutoff(expressions), 1e7]]), comparatorByProperty('factorValue'), columnHeaders),
                rows: createOrdering(combineRanks([[rankColumnsByExpression(transposed), 1e3], [rankColumnsByThreshold(0.05 + 0.4 / (1 + expressions.length / 5), transposed), 1e6]]), comparatorByProperty('name'), rows)
            }
        };
    } else {
        return {
            default: {
                name: 'Default',
                columns: noOrdering(columnHeaders),
                rows: noOrdering(rows)
            }
        };
    }
};

var extractExpressionValues = function extractExpressionValues(rows, experiment) {
    var _valueFieldExtractor = function _valueFieldExtractor(valueField) {
        return function (expression) {
            return expression.hasOwnProperty(valueField) ? { value: expression[valueField] } : {};
        };
    };

    return rows.map(function (row) {
        return row.expressions.map(_valueFieldExtractor((0, _experimentTypeUtils.isDifferential)(experiment) ? 'foldChange' : 'value'));
    });
};

var createOrderingsForData = function createOrderingsForData(experiment, rows, columnHeaders) {
    return createOrderings(extractExpressionValues(rows, experiment), columnHeaders, rows, experiment);
};

var _default = createOrderingsForData;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(createOrdering, 'createOrdering', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(createAlphabeticalOrdering, 'createAlphabeticalOrdering', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(comparatorByProperty, 'comparatorByProperty', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(rankColumnsByWhereTheyAppearFirst, 'rankColumnsByWhereTheyAppearFirst', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(highestColumnRankPossible, 'highestColumnRankPossible', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(thresholdColumnsByExpressionAboveCutoff, 'thresholdColumnsByExpressionAboveCutoff', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(rankColumnsByExpression, 'rankColumnsByExpression', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(rankColumnsByThreshold, 'rankColumnsByThreshold', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(noOrdering, 'noOrdering', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(combineRanks, 'combineRanks', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(createOrderings, 'createOrderings', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(extractExpressionValues, 'extractExpressionValues', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(createOrderingsForData, 'createOrderingsForData', 'src/load/heatmapOrderings.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/load/heatmapOrderings.js');
}();

;