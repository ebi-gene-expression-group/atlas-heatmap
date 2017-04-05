import getChartConfiguration from './chartConfiguration.js';

import getHeatmapData from './heatmapData.js';
import getBoxplotData from './boxplotData.js';

import createOrderingsForData from './heatmapOrderings.js';
import getColourAxisFromDataSeries from './heatmapColourAxis.js';
import {getExpressionLevelFilters, getColumnGroupingFilters} from './heatmapFilters.js';

export default function(data, inProxy, outProxy, atlasUrl, pathToResources, isWidget) {

    // This ensures that adding or removing coexpressed genes doesn’t change the colours in the heat map. Colours are
    // computed upfront and then we just add/remove rows with the coexpression slider.
    // coexpressions is an array because at first it was envisioned that the JSON payload could carry coexpressions of
    // more than one gene, but that’s not the case, and ended up being a single item array.
    const allRows =
        data.coexpressions ? data.profiles.rows.concat(data.coexpressions[0].jsonProfiles.rows) : data.profiles.rows;

    const heatmapData =
        getHeatmapData(
            allRows, data.config.geneQuery, data.columnHeaders, data.columnGroupings, data.experiment,
            inProxy, atlasUrl, pathToResources);

    const boxplotData = getBoxplotData(data.profiles, data.columnHeaders, data.experiment, heatmapData);

    return {
        heatmapData,
        boxplotData,
        heatmapConfig: getChartConfiguration(data, inProxy, outProxy, atlasUrl, isWidget),
        colourAxis : getColourAxisFromDataSeries(data.experiment, heatmapData.dataSeries),
        orderings: createOrderingsForData(data.experiment, allRows, data.columnHeaders),
        expressionLevelFilters: getExpressionLevelFilters(data.experiment, heatmapData.dataSeries),
        groupingFilters: getColumnGroupingFilters(heatmapData.xAxisCategories)
    }

};
