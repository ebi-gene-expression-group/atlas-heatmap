'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.colourAxisPropTypes = exports.dataSeriesPropTypes = exports.filterPropTypes = exports.orderingsPropTypesValidator = exports.chartDataPropTypes = exports.heatmapDataPropTypes = exports.heatmapConfigPropTypes = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _experimentTypeUtils = require('../load/experimentTypeUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const heatmapDataPropTypes = (props, propName) => {
//     const heatmapData = props[propName];
//     // const possiblyError = ValidateDataSeries(heatmapData.dataSeries);
//     // if (possiblyError !== undefined) {
//     //     return possiblyError;
//     // }
//
//     const width = heatmapData.xAxisCategories.length;
//     const height = heatmapData.yAxisCategories.length;
//
//     for (let i = 0; i < heatmapData.dataSeries.length; i++) {
//         for (let j = 0; j < heatmapData.dataSeries[i].data.length; j++) {
//             const point = heatmapData.dataSeries[i].data[j];
//             const x = point.x;
//             const y = point.y;
//             if (x < 0 || y < 0 || x >= width || y >= height) {
//                 return new Error(`Point with coordinates outside range: ${x}, ${y}`);
//             }
//         }
//     }
// };

var differentialTooltipPropTypes = PropTypes.shape({
    contrastDescription: PropTypes.string.isRequired,
    experimentDescription: PropTypes.string.isRequired,
    properties: PropTypes.arrayOf(PropTypes.shape({
        contrastPropertyType: PropTypes.oneOf(['FACTOR', 'SAMPLE']),
        propertyName: PropTypes.string.isRequired,
        referenceValue: PropTypes.string.isRequired,
        testValue: PropTypes.string.isRequired
    })).isRequired,
    referenceReplicates: PropTypes.number.isRequired,
    resources: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
    })).isRequired,
    testReplicates: PropTypes.number.isRequired
});

var baselineTooltipPropTypes = PropTypes.shape({
    properties: PropTypes.arrayOf(PropTypes.shape({
        contrastPropertyType: PropTypes.oneOf(['FACTOR', 'SAMPLE']),
        propertyName: PropTypes.string.isRequired,
        testValue: PropTypes.string.isRequired
    })).isRequired,
    replicates: PropTypes.number.isRequired
});

var baselineExperimentsTooltipPropTypes = PropTypes.shape({});

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

var dataSeriesPropTypes = PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
        info: PropTypes.shape({
            unit: PropTypes.string.isRequired,
            foldChange: PropTypes.number, // These three only in diff experiments
            pValue: PropTypes.number,
            tStat: PropTypes.number
        }).isRequired,
        value: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    })).isRequired,
    info: PropTypes.shape({
        colour: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired
}));

var heatmapDataPropTypes = PropTypes.shape({
    dataSeries: dataSeriesPropTypes.isRequired,
    xAxisCategories: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        info: PropTypes.shape({
            groupings: PropTypes.arrayOf(PropTypes.shape({
                memberName: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                values: PropTypes.arrayOf(PropTypes.shape({
                    id: PropTypes.string.isRequired,
                    label: PropTypes.string.isRequired
                })).isRequired
            })).isRequired,
            tooltip: PropTypes.oneOfType([differentialTooltipPropTypes, baselineTooltipPropTypes, baselineExperimentsTooltipPropTypes]).isRequired,
            trackId: PropTypes.string.isRequired
        }).isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    yAxisCategories: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        info: PropTypes.shape({
            designElement: PropTypes.string.isRequired,
            trackId: PropTypes.string.isRequired
        }).isRequired,
        label: PropTypes.string.isRequired
    })).isRequired
});

var boxplotDataPropTypes = PropTypes.shape({
    dataSeries: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    xAxisCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired
});

var heatmapConfigPropTypes = PropTypes.shape({
    inProxy: PropTypes.string.isRequired,
    outProxy: PropTypes.string.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genomeBrowsers: PropTypes.arrayOf(PropTypes.string).isRequired,
    introductoryMessage: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    xAxisLegendName: PropTypes.string.isRequired,
    yAxisLegendName: PropTypes.string.isRequired,

    experiment: _experimentTypeUtils.experimentPropTypes,

    disclaimer: PropTypes.string.isRequired,
    coexpressionsAvailable: PropTypes.bool.isRequired,
    isMultiExperiment: PropTypes.bool.isRequired,
    isBaseline: PropTypes.bool.isRequired,
    isDifferential: PropTypes.bool.isRequired

});

var filterPropTypes = PropTypes.shape({
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired
    })).isRequired,
    valueGroupings: PropTypes.array // Indirectly validated as [string, array of strings] in FilterOption
});

var colourAxisPropTypes = PropTypes.shape({
    unit: PropTypes.string.isRequired,
    dataClasses: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired
    })).isRequired
});

var chartDataPropTypes = PropTypes.shape({
    heatmapConfig: heatmapConfigPropTypes.isRequired,
    colourAxis: colourAxisPropTypes,
    orderings: orderingsPropTypesValidator,
    heatmapData: heatmapDataPropTypes.isRequired,
    boxplotData: boxplotDataPropTypes,
    expressionLevelFilters: filterPropTypes.isRequired,
    groupingFilters: PropTypes.arrayOf(filterPropTypes)
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