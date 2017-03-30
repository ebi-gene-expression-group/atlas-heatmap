import getHeatmapDataSeries from './heatmapDataSeries.js';
import {getHeatmapXAxisCategories, getHeatmapYAxisCategories} from './heatmapAxisCategories';

export default (allRows, geneQuery, columnHeaders, columnGroupings, experiment, inProxy, atlasUrl, pathToResources) =>
    ({
        xAxisCategories:
            getHeatmapXAxisCategories(columnHeaders, columnGroupings, experiment, inProxy, atlasUrl, pathToResources),
        yAxisCategories: getHeatmapYAxisCategories(allRows, geneQuery, experiment),
        dataSeries: getHeatmapDataSeries(allRows, experiment)
    });
