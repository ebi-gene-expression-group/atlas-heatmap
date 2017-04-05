import React from 'react';
import {experimentPropTypes} from '../load/experimentTypeUtils';

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

const differentialTooltipPropTypes = React.PropTypes.shape({
    contrastDescription: React.PropTypes.string.isRequired,
    experimentDescription: React.PropTypes.string.isRequired,
    properties: React.PropTypes.arrayOf(React.PropTypes.shape({
        contrastPropertyType: React.PropTypes.oneOf([`FACTOR`, `SAMPLE`]),
        propertyName: React.PropTypes.string.isRequired,
        referenceValue: React.PropTypes.string.isRequired,
        testValue: React.PropTypes.string.isRequired
    })).isRequired,
    referenceReplicates: React.PropTypes.number.isRequired,
    resources: React.PropTypes.arrayOf(React.PropTypes.shape({
        icon: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired
    })).isRequired,
    testReplicates: React.PropTypes.number.isRequired
});

const baselineTooltipPropTypes = React.PropTypes.shape({
    properties: React.PropTypes.arrayOf(React.PropTypes.shape({
        contrastPropertyType: React.PropTypes.oneOf([`FACTOR`, `SAMPLE`]),
        propertyName: React.PropTypes.string.isRequired,
        testValue: React.PropTypes.string.isRequired
    })).isRequired,
    replicates: React.PropTypes.number.isRequired
});

const baselineExperimentsTooltipPropTypes = React.PropTypes.shape({});

const orderingsPropTypesValidator = (props, propName, componentName) => {
    const orderings = props[propName];

    const isPermutation = (arr) =>
        [].concat(arr)
            .sort((a, b) => a - b)
            .map((el, ix) => el === ix)
            .reduce((l, r) => l && r);

    if (!orderings.hasOwnProperty(`default`)) {
        return new Error(`Default ordering missing in '${componentName}'`);
    }

    Object.keys(orderings).forEach(orderingName => {
        const ordering = orderings[orderingName];

        if (!isPermutation(ordering.columns)) {
            return new Error(`Column ordering invalid: '${orderingName}' in '${componentName}'`);
        }
        if (!isPermutation(ordering.rows)) {
            return new Error(`Row ordering invalid: '${orderingName}' in '${componentName}'`);
        }
    });
};

const heatmapDataPropTypes = React.PropTypes.shape({
    dataSeries: React.PropTypes.arrayOf(React.PropTypes.shape({
        data: React.PropTypes.arrayOf(React.PropTypes.shape({
            info: React.PropTypes.shape({
                unit: React.PropTypes.string.isRequired,
                foldChange: React.PropTypes.number, // These three only in diff experiments
                pValue: React.PropTypes.number,
                tStat: React.PropTypes.number
            }).isRequired,
            value: React.PropTypes.number.isRequired,
            x: React.PropTypes.number.isRequired,
            y: React.PropTypes.number.isRequired
        })).isRequired,
        info: React.PropTypes.shape({
            colour: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired
        }).isRequired
    })).isRequired,
    xAxisCategories: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        info: React.PropTypes.shape({
            groupings: React.PropTypes.arrayOf(React.PropTypes.shape({
                memberName: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
                values: React.PropTypes.arrayOf(React.PropTypes.shape({
                    id: React.PropTypes.string.isRequired,
                    label: React.PropTypes.string.isRequired
                })).isRequired,
            })).isRequired,
            tooltip: React.PropTypes.oneOfType([
                differentialTooltipPropTypes,
                baselineTooltipPropTypes,
                baselineExperimentsTooltipPropTypes
            ]).isRequired,
            trackId: React.PropTypes.string.isRequired
        }).isRequired,
        label: React.PropTypes.string.isRequired
    })).isRequired,
    yAxisCategories: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        info: React.PropTypes.shape({
            designElement: React.PropTypes.string.isRequired,
            trackId: React.PropTypes.string.isRequired
        }).isRequired,
        label: React.PropTypes.string.isRequired
    })).isRequired
});

const boxplotDataPropTypes = React.PropTypes.shape({
    dataSeries: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)).isRequired,
    xAxisCategories: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    title: React.PropTypes.string.isRequired,
    unit: React.PropTypes.string.isRequired
});

const heatmapConfigPropTypes = React.PropTypes.shape({
    inProxy: React.PropTypes.string.isRequired,
    outProxy: React.PropTypes.string.isRequired,
    atlasUrl: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    genomeBrowserTemplate: React.PropTypes.string.isRequired,
    introductoryMessage: React.PropTypes.string.isRequired,
    shortDescription: React.PropTypes.string.isRequired,
    xAxisLegendName: React.PropTypes.string.isRequired,
    yAxisLegendName: React.PropTypes.string.isRequired,

    experiment: experimentPropTypes,

    disclaimer: React.PropTypes.string.isRequired,
    coexpressionsAvailable: React.PropTypes.bool.isRequired,
    isMultiExperiment: React.PropTypes.bool.isRequired,
    isBaseline: React.PropTypes.bool.isRequired,
    isDifferential: React.PropTypes.bool.isRequired

});

const filterPropTypes = React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    values: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool.isRequired
    })).isRequired,
    valueGroupings: React.PropTypes.array // Indirectly validated as [string, array of strings] in FilterOption
});

const colourAxisPropTypes = React.PropTypes.shape({
    dataClasses: React.PropTypes.arrayOf(React.PropTypes.shape({
        colour: React.PropTypes.string.isRequired,
        from: React.PropTypes.number.isRequired,
        to: React.PropTypes.number.isRequired
    })).isRequired
});

const chartDataPropTypes = React.PropTypes.shape({
    heatmapConfig: heatmapConfigPropTypes.isRequired,
    colourAxis: colourAxisPropTypes,
    orderings: orderingsPropTypesValidator,
    heatmapData: heatmapDataPropTypes.isRequired,
    boxplotData: boxplotDataPropTypes,
    expressionLevelFilters: filterPropTypes.isRequired,
    groupingFilters: React.PropTypes.arrayOf(filterPropTypes)
});

export {heatmapConfigPropTypes, heatmapDataPropTypes, chartDataPropTypes, orderingsPropTypesValidator, filterPropTypes, colourAxisPropTypes};
