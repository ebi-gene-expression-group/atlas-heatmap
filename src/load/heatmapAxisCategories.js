import Url from 'url'

import {isMultiExperiment, isDifferential} from './experimentTypeUtils.js'

const getHeatmapXAxisCategories = ({columnHeaders, experiment}) => {
  if (isMultiExperiment(experiment)) {
    return columnHeaders.map(columnHeader => ({
      label: columnHeader.factorValue,
      id: columnHeader.factorValueOntologyTermId || ``,
      info: {
        trackId: ``,
        tooltip: {}
      }
    }))
  } else if (isDifferential(experiment)) {
    return columnHeaders.map(columnHeader => ({
      label: columnHeader.displayName,
      id: columnHeader.id,
      info: {
        trackId: columnHeader.id,
        tooltip: {
          ...columnHeader.contrastSummary
        }
      }
    }))
  } else {
    return columnHeaders.map(columnHeader => ({
      label: columnHeader.factorValue,
      id: columnHeader.factorValueOntologyTermId || ``,
      info: {
        trackId: columnHeader.assayGroupId,
        tooltip: {
          properties: columnHeader.assayGroupSummary.properties,
          replicates: columnHeader.assayGroupSummary.replicates,
        }
      }
    }))
  }
}

const getHeatmapYAxisCategories = ({rows, inProxy, atlasUrl}) =>
  rows.map(
    profile => ({
      label: profile.name,
      id: profile.id,
      info: {
        trackId: profile.id,
        designElement: profile.designElement || ``,
        url: Url.resolve(inProxy + atlasUrl, profile.uri)
      }
    })
  )

export {getHeatmapXAxisCategories, getHeatmapYAxisCategories}
