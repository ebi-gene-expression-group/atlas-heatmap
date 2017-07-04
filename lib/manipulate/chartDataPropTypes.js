'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.colourAxisPropTypes = exports.dataSeriesPropTypes = exports.filterPropTypes = exports.orderingsPropTypesValidator = exports.chartDataPropTypes = exports.heatmapDataPropTypes = exports.heatmapConfigPropTypes = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _experimentTypeUtils = require('../load/experimentTypeUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const heatmapDataPropTypes = (props, propName) => {
//     const heatmapData = props[propName]
//     // const possiblyError = ValidateDataSeries(heatmapData.dataSeries)
//     // if (possiblyError !== undefined) {
//     //     return possiblyError
//     // }
//
//     const width = heatmapData.xAxisCategories.length
//     const height = heatmapData.yAxisCategories.length
//
//     for (let i = 0 i < heatmapData.dataSeries.length i++) {
//         for (let j = 0 j < heatmapData.dataSeries[i].data.length j++) {
//             const point = heatmapData.dataSeries[i].data[j]
//             const x = point.x
//             const y = point.y
//             if (x < 0 || y < 0 || x >= width || y >= height) {
//                 return new Error(`Point with coordinates outside range: ${x}, ${y}`)
//             }
//         }
//     }
// }

var differentialTooltipPropTypes = _propTypes2.default.shape({
    contrastDescription: _propTypes2.default.string.isRequired,
    experimentDescription: _propTypes2.default.string.isRequired,
    properties: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        contrastPropertyType: _propTypes2.default.oneOf(['FACTOR', 'SAMPLE']),
        propertyName: _propTypes2.default.string.isRequired,
        referenceValue: _propTypes2.default.string.isRequired,
        testValue: _propTypes2.default.string.isRequired
    })).isRequired,
    referenceReplicates: _propTypes2.default.number.isRequired,
    resources: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        icon: _propTypes2.default.string.isRequired,
        type: _propTypes2.default.string.isRequired,
        url: _propTypes2.default.string.isRequired
    })).isRequired,
    testReplicates: _propTypes2.default.number.isRequired
});

var baselineTooltipPropTypes = _propTypes2.default.shape({
    properties: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        contrastPropertyType: _propTypes2.default.oneOf(['FACTOR', 'SAMPLE']),
        propertyName: _propTypes2.default.string.isRequired,
        testValue: _propTypes2.default.string.isRequired
    })).isRequired,
    replicates: _propTypes2.default.number.isRequired
});

var baselineExperimentsTooltipPropTypes = _propTypes2.default.shape({});

var orderingsPropTypesValidator = function orderingsPropTypesValidator(props, propName, componentName) {
    var orderings = props[propName];

    var isPermutation = function isPermutation(arr) {
        return [].concat(arr).sort(function (a, b) {
            return a - b;
        }).map(function (el, ix) {
            return el === ix;
        }).reduce(function (l, r) {
            return l && r;
        });
    };

    if (!orderings.hasOwnProperty('default')) {
        return new Error('Default ordering missing in \'' + componentName + '\'');
    }

    Object.keys(orderings).forEach(function (orderingName) {
        var ordering = orderings[orderingName];

        if (!isPermutation(ordering.columns)) {
            return new Error('Column ordering invalid: \'' + orderingName + '\' in \'' + componentName + '\'');
        }
        if (!isPermutation(ordering.rows)) {
            return new Error('Row ordering invalid: \'' + orderingName + '\' in \'' + componentName + '\'');
        }
    });
};

var dataSeriesPropTypes = _propTypes2.default.arrayOf(_propTypes2.default.shape({
    data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        info: _propTypes2.default.shape({
            unit: _propTypes2.default.string.isRequired,
            foldChange: _propTypes2.default.number, // These three only in diff experiments
            pValue: _propTypes2.default.number,
            tStat: _propTypes2.default.number
        }).isRequired,
        value: _propTypes2.default.number.isRequired,
        x: _propTypes2.default.number.isRequired,
        y: _propTypes2.default.number.isRequired
    })).isRequired,
    info: _propTypes2.default.shape({
        colour: _propTypes2.default.string.isRequired,
        name: _propTypes2.default.string.isRequired
    }).isRequired
}));

var heatmapDataPropTypes = _propTypes2.default.shape({
    dataSeries: dataSeriesPropTypes.isRequired,
    xAxisCategories: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        id: _propTypes2.default.string.isRequired,
        info: _propTypes2.default.shape({
            groupings: _propTypes2.default.arrayOf(_propTypes2.default.shape({
                memberName: _propTypes2.default.string.isRequired,
                name: _propTypes2.default.string.isRequired,
                values: _propTypes2.default.arrayOf(_propTypes2.default.shape({
                    id: _propTypes2.default.string.isRequired,
                    label: _propTypes2.default.string.isRequired
                })).isRequired
            })).isRequired,
            tooltip: _propTypes2.default.oneOfType([differentialTooltipPropTypes, baselineTooltipPropTypes, baselineExperimentsTooltipPropTypes]).isRequired,
            trackId: _propTypes2.default.string.isRequired
        }).isRequired,
        label: _propTypes2.default.string.isRequired
    })).isRequired,
    yAxisCategories: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        id: _propTypes2.default.string.isRequired,
        info: _propTypes2.default.shape({
            designElement: _propTypes2.default.string.isRequired,
            trackId: _propTypes2.default.string.isRequired
        }).isRequired,
        label: _propTypes2.default.string.isRequired
    })).isRequired
});

var boxplotDataPropTypes = _propTypes2.default.shape({
    dataSeries: _propTypes2.default.arrayOf(_propTypes2.default.arrayOf(_propTypes2.default.number)).isRequired,
    xAxisCategories: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    title: _propTypes2.default.string.isRequired,
    unit: _propTypes2.default.string.isRequired
});

var heatmapConfigPropTypes = _propTypes2.default.shape({
    inProxy: _propTypes2.default.string.isRequired,
    outProxy: _propTypes2.default.string.isRequired,
    atlasUrl: _propTypes2.default.string.isRequired,
    description: _propTypes2.default.string.isRequired,
    genomeBrowsers: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    introductoryMessage: _propTypes2.default.string.isRequired,
    shortDescription: _propTypes2.default.string.isRequired,
    xAxisLegendName: _propTypes2.default.string.isRequired,
    yAxisLegendName: _propTypes2.default.string.isRequired,

    experiment: _experimentTypeUtils.experimentPropTypes,

    disclaimer: _propTypes2.default.string.isRequired,
    coexpressionsAvailable: _propTypes2.default.bool.isRequired,
    isMultiExperiment: _propTypes2.default.bool.isRequired,
    isBaseline: _propTypes2.default.bool.isRequired,
    isDifferential: _propTypes2.default.bool.isRequired

});

var filterPropTypes = _propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    values: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        name: _propTypes2.default.string.isRequired,
        disabled: _propTypes2.default.bool.isRequired
    })).isRequired,
    valueGroupings: _propTypes2.default.array // Indirectly validated as [string, array of strings] in FilterOption
});

var colourAxisPropTypes = _propTypes2.default.shape({
    unit: _propTypes2.default.string.isRequired,
    dataClasses: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        color: _propTypes2.default.string.isRequired,
        from: _propTypes2.default.number.isRequired,
        to: _propTypes2.default.number.isRequired
    })).isRequired
});

var chartDataPropTypes = _propTypes2.default.shape({
    heatmapConfig: heatmapConfigPropTypes.isRequired,
    colourAxis: colourAxisPropTypes,
    orderings: orderingsPropTypesValidator,
    heatmapData: heatmapDataPropTypes.isRequired,
    boxplotData: boxplotDataPropTypes,
    expressionLevelFilters: filterPropTypes.isRequired,
    groupingFilters: _propTypes2.default.arrayOf(filterPropTypes)
});

exports.heatmapConfigPropTypes = heatmapConfigPropTypes;
exports.heatmapDataPropTypes = heatmapDataPropTypes;
exports.chartDataPropTypes = chartDataPropTypes;
exports.orderingsPropTypesValidator = orderingsPropTypesValidator;
exports.filterPropTypes = filterPropTypes;
exports.dataSeriesPropTypes = dataSeriesPropTypes;
exports.colourAxisPropTypes = colourAxisPropTypes;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(differentialTooltipPropTypes, 'differentialTooltipPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(baselineTooltipPropTypes, 'baselineTooltipPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(baselineExperimentsTooltipPropTypes, 'baselineExperimentsTooltipPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(orderingsPropTypesValidator, 'orderingsPropTypesValidator', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(dataSeriesPropTypes, 'dataSeriesPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(heatmapDataPropTypes, 'heatmapDataPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(boxplotDataPropTypes, 'boxplotDataPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(heatmapConfigPropTypes, 'heatmapConfigPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(filterPropTypes, 'filterPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(colourAxisPropTypes, 'colourAxisPropTypes', 'src/manipulate/chartDataPropTypes.js');

    __REACT_HOT_LOADER__.register(chartDataPropTypes, 'chartDataPropTypes', 'src/manipulate/chartDataPropTypes.js');
}();

;