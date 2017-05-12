import React from 'react';

import DataSeriesHeatmapLegend from './DataSeriesHeatmapLegend.jsx';
import GradientHeatmapLegend from './GradientHeatmapLegend.jsx';

import {heatmapConfigPropTypes, dataSeriesPropTypes, colourAxisPropTypes}
from '../../manipulate/chartDataPropTypes.js';

const DataSeriesLegend = ({dataSeries, selectedExpressionLevelFilters}) => {
    const legendItems = dataSeries.map(series =>
            ({
                key: series.info.name,
                name: series.info.name,
                colour: series.info.colour,
                on: selectedExpressionLevelFilters.includes(series.info.name)
            }));

    return <DataSeriesHeatmapLegend legendItems={legendItems} />;
}

DataSeriesLegend.propTypes = {
  dataSeries: dataSeriesPropTypes.isRequired,
  selectedExpressionLevelFilters: React.PropTypes.array,
}

const GradientLegend = ({colourAxis, heatmapConfig}) => {
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

    return (
      <GradientHeatmapLegend
        gradients={[
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
        ]}
        experiment={heatmapConfig.experiment}
      />
    )
}

GradientLegend.propTypes = {
  heatmapConfig: heatmapConfigPropTypes.isRequired,
  colourAxis: colourAxisPropTypes.isRequired
}

export {DataSeriesLegend, GradientLegend};
