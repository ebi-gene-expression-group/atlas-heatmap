import getHeatmapDataSeries from './heatmapDataSeries.js'
import {getHeatmapXAxisCategories, getHeatmapYAxisCategories} from './heatmapAxisCategories'

export default ({allRows, geneQuery, columnHeaders, experiment, inProxy, atlasUrl, pathToResources}) =>
  ({
    xAxisCategories:
      getHeatmapXAxisCategories({columnHeaders, experiment, inProxy, atlasUrl, pathToResources}),
    yAxisCategories: getHeatmapYAxisCategories({rows: allRows, geneQuery, experiment, inProxy, atlasUrl}),
    dataSeries: getHeatmapDataSeries(allRows, experiment)
  })
