import React from 'react'
import PropTypes from 'prop-types'
import {experimentPropTypes} from '../load/experimentTypeUtils'

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

const differentialTooltipPropTypes = PropTypes.shape({
    contrastDescription: PropTypes.string.isRequired,
    experimentDescription: PropTypes.string.isRequired,
    properties: PropTypes.arrayOf(PropTypes.shape({
        contrastPropertyType: PropTypes.oneOf([`FACTOR`, `SAMPLE`]),
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
})

const baselineTooltipPropTypes = PropTypes.shape({
    properties: PropTypes.arrayOf(PropTypes.shape({
        contrastPropertyType: PropTypes.oneOf([`FACTOR`, `SAMPLE`]),
        propertyName: PropTypes.string.isRequired,
        testValue: PropTypes.string.isRequired
    })).isRequired,
    replicates: PropTypes.number.isRequired
})

const baselineExperimentsTooltipPropTypes = PropTypes.shape({})

const orderingsPropTypesValidator = (props, propName, componentName) => {
    const orderings = props[propName]

    const isPermutation = (arr) =>
        [].concat(arr)
            .sort((a, b) => a - b)
            .map((el, ix) => el === ix)
            .reduce((l, r) => l && r)

    if (!orderings.hasOwnProperty(`default`)) {
        return new Error(`Default ordering missing in '${componentName}'`)
    }

    Object.keys(orderings).forEach(orderingName => {
        const ordering = orderings[orderingName]

        if (!isPermutation(ordering.columns)) {
            return new Error(`Column ordering invalid: '${orderingName}' in '${componentName}'`)
        }
        if (!isPermutation(ordering.rows)) {
            return new Error(`Row ordering invalid: '${orderingName}' in '${componentName}'`)
        }
    })
}

const dataSeriesPropTypes = PropTypes.arrayOf(PropTypes.shape({
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
}))

const heatmapDataPropTypes = PropTypes.shape({
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
                })).isRequired,
            })).isRequired,
            tooltip: PropTypes.oneOfType([
                differentialTooltipPropTypes,
                baselineTooltipPropTypes,
                baselineExperimentsTooltipPropTypes
            ]).isRequired,
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
})

const boxplotDataPropTypes = PropTypes.shape({
    dataSeries: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    xAxisCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired
})

const heatmapConfigPropTypes = PropTypes.shape({
    inProxy: PropTypes.string.isRequired,
    outProxy: PropTypes.string.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genomeBrowsers: PropTypes.arrayOf(PropTypes.string).isRequired,
    introductoryMessage: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    xAxisLegendName: PropTypes.string.isRequired,
    yAxisLegendName: PropTypes.string.isRequired,

    experiment: experimentPropTypes,

    disclaimer: PropTypes.string.isRequired,
    coexpressionsAvailable: PropTypes.bool.isRequired,
    isMultiExperiment: PropTypes.bool.isRequired,
    isBaseline: PropTypes.bool.isRequired,
    isDifferential: PropTypes.bool.isRequired

})

const filterPropTypes = PropTypes.shape({
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool.isRequired
    })).isRequired,
    valueGroupings: PropTypes.array // Indirectly validated as [string, array of strings] in FilterOption
})

const colourAxisPropTypes = PropTypes.shape({
    unit: PropTypes.string.isRequired,
    dataClasses: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        from: PropTypes.number.isRequired,
        to: PropTypes.number.isRequired
    })).isRequired
})

const chartDataPropTypes = PropTypes.shape({
    heatmapConfig: heatmapConfigPropTypes.isRequired,
    colourAxis: colourAxisPropTypes,
    orderings: orderingsPropTypesValidator,
    heatmapData: heatmapDataPropTypes.isRequired,
    boxplotData: boxplotDataPropTypes,
    expressionLevelFilters: filterPropTypes.isRequired,
    groupingFilters: PropTypes.arrayOf(filterPropTypes)
})

export {heatmapConfigPropTypes, heatmapDataPropTypes, chartDataPropTypes, orderingsPropTypesValidator, filterPropTypes, dataSeriesPropTypes, colourAxisPropTypes}
