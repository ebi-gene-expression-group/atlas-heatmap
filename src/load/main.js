import {anatomogramSpecies} from 'anatomogram'

import getChartConfiguration from './chartConfiguration.js'

import getHeatmapData from './heatmapData.js'

import createOrderingsForData from './heatmapOrderings.js'
import getColourAxisFromDataSeries from './heatmapColourAxis.js'
import columnsWithGroupings from './heatmapFilters.js'
import URI from 'urijs'

export default function({data, inProxy, outProxy, atlasUrl, showAnatomogram, showControlMenu, isWidget}) {
    const pathToResources = inProxy + URI(`resources/js-bundles/`, atlasUrl).toString()

    // This ensures that adding or removing coexpressed genes doesn’t change the colours in the heat map. Colours are
    // computed upfront and then we just add/remove rows with the coexpression slider.
    // coexpressions is an array because at first it was envisioned that the JSON payload could carry coexpressions of
    // more than one gene, but that’s not the case, and ended up being a single item array.
    const allRows =
        data.coexpressions ? data.profiles.rows.concat(data.coexpressions[0].jsonProfiles.rows) : data.profiles.rows

    const heatmapData =
        getHeatmapData(Object.assign({}, data, {allRows,geneQuery: data.config.geneQuery,inProxy,atlasUrl,pathToResources}))

    //misses: idsExpressedInExperiment
    //show is extra
    const anatomogramConfig = {
        atlasUrl: atlasUrl,
        show: showAnatomogram && !! data.anatomogram && anatomogramSpecies.includes(data.anatomogram.species),
        anatomogramData: data.anatomogram,
        expressedTissueColour: data.experiment ? `gray` : `red`,
        hoveredTissueColour: data.experiment ? `red` : `purple`,
    }

    const geneSpecificResults =
        data.experiment
        && data.experiment.urls
        && data.experiment.urls.gene_specific_results
        ? {
            url: inProxy + URI(data.experiment.urls.gene_specific_results, atlasUrl).toString(),
            keepOnlyTheseColumnIds:data.columnHeaders.map(e => e.assayGroupId).filter((e,ix, self) => self.indexOf(e) == ix ).filter(e=>e)
        }
        : null

    return {
        anatomogramConfig,
        heatmapData,
        geneSpecificResults,
        heatmapConfig: getChartConfiguration(data, inProxy, outProxy, atlasUrl, isWidget, showControlMenu),
        colourAxis : getColourAxisFromDataSeries(data.experiment, heatmapData.dataSeries),
        orderings: createOrderingsForData(data.experiment, allRows, data.columnHeaders),
        columnGroups: columnsWithGroupings({heatmapData, columnGroupings: data.columnGroupings})
    }
}
