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

function renderGradientLegend(colourAxis) {
    const minDownRegulatedValue =
        Math.min(...colourAxis.dataClasses.filter(dataClass => dataClass.from <= 0).map(dataClass => dataClass.from));
    const minDownRegulatedColour =
        colourAxis.dataClasses.find(dataClass => dataClass.from === minDownRegulatedValue).color;

    const maxDownRegulatedValue =
        Math.max(...colourAxis.dataClasses.filter(dataClass => dataClass.to <= 0).map(dataClass => dataClass.to));
    const maxDownRegulatedColour =
        colourAxis.dataClasses.find(dataClass => dataClass.to === maxDownRegulatedValue).color;

    const minUpRegulatedValue =
        Math.min(...colourAxis.dataClasses.filter(dataClass => dataClass.from > 0).map(dataClass => dataClass.from));
    const minUpRegulatedColour =
        colourAxis.dataClasses.find(dataClass => dataClass.from === minUpRegulatedValue).color;

    const maxUpRegulatedValue =
        Math.max(...colourAxis.dataClasses.filter(dataClass => dataClass.to > 0).map(dataClass => dataClass.to));
    const maxUpRegulatedColour =
        colourAxis.dataClasses.find(dataClass => dataClass.to === maxUpRegulatedValue).color;

    // Baseline experiments will only have up-regulated values
    const gradientLegendProps = ({
        minDownRegulatedValue,
        minDownRegulatedColour,
        maxDownRegulatedValue,
        maxDownRegulatedColour,
        minUpRegulatedValue,
        minUpRegulatedColour,
        maxUpRegulatedValue,
        maxUpRegulatedColour
    });

    return <GradientHeatmapLegend {...gradientLegendProps} />;
}


const HeatmapLegend = props => {
        if (props.heatmapConfig.isMultiExperiment) {
            return renderDataSeriesLegend(props.dataSeries, props.selectedExpressionLevelFilters);
        } else if (props.heatmapConfig.experiment) {
            return renderGradientLegend(props.colourAxis);
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