import React from 'react';

import DataSeriesHeatmapLegend from './DataSeriesHeatmapLegend.jsx';
import GradientHeatmapLegend from './GradientHeatmapLegend.jsx';

import {heatmapConfigPropTypes, dataSeriesPropTypes, colourAxisPropTypes}
from '../../manipulate/chartDataPropTypes.js';

function renderDataSeriesLegend(dataSeries, selectedExpressionLevelFilters) {
    const legendItems = dataSeries.map(series =>
            ({
                key: series.info.name,
                name: series.info.name,
                colour: series.info.colour,
                on: selectedExpressionLevelFilters.includes(series.info.name)
            }));

    return <DataSeriesHeatmapLegend legendItems={legendItems} />;
}

function renderGradientLegend(colourAxis, experiment) {
    const minDownRegulatedValue =
        Math.min(...colourAxis.dataClasses.filter(dataClass => dataClass.from <= 0).map(dataClass => dataClass.from));
    const maxDownRegulatedValue =
        Math.max(...colourAxis.dataClasses.filter(dataClass => dataClass.to <= 0).map(dataClass => dataClass.to));
    const downRegulatedColours =
        colourAxis.dataClasses.filter(dataClass => dataClass.from <= 0).map(dataClass => dataClass.color);

    const minUpRegulatedValue =
        Math.min(...colourAxis.dataClasses.filter(dataClass => dataClass.from >= 0).map(dataClass => dataClass.from));
    const maxUpRegulatedValue =
        Math.max(...colourAxis.dataClasses.filter(dataClass => dataClass.to >= 0).map(dataClass => dataClass.to));
    const upRegulatedColours =
        colourAxis.dataClasses.filter(dataClass => dataClass.from >= 0).map(dataClass => dataClass.color);

    // Baseline experiments will only have up-regulated values
    const gradientLegendProps = ({
        gradients: [
            {
                fromValue: minDownRegulatedValue,
                toValue: maxDownRegulatedValue,
                colours: downRegulatedColours
            },
            {
                fromValue: minUpRegulatedValue,
                toValue: maxUpRegulatedValue,
                colours: upRegulatedColours
            }
        ],
        experiment
    });

    return <GradientHeatmapLegend {...gradientLegendProps} />;
}


const HeatmapLegend = props => {
        if (props.heatmapConfig.isMultiExperiment) {
            return renderDataSeriesLegend(props.dataSeries, props.selectedExpressionLevelFilters);
        } else if (props.heatmapConfig.experiment) {
            return renderGradientLegend(props.colourAxis, props.heatmapConfig.experiment);
        } else {
            return null;
        }
};

HeatmapLegend.propTypes = {
    heatmapConfig: heatmapConfigPropTypes.isRequired,
    dataSeries: dataSeriesPropTypes.isRequired,
    selectedExpressionLevelFilters: React.PropTypes.array,
    colourAxis: colourAxisPropTypes
};

export default HeatmapLegend;