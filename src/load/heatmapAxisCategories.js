import Url from 'url'
import Path from 'path'

import {isMultiExperiment, isDifferential} from './experimentTypeUtils.js'

// For each column grouping get the groups that contain a specific ID, or the group Unmapped if it has no groups
const getGroupsThatContainId = (columnGroupings, id) =>
    columnGroupings.map(grouping => {
        const values =
            grouping.groups
                .filter(group => group.values.includes(id))
                .map(group => ({
                    label: group.name,
                    id: group.id
                }))

        return {
            name: grouping.name,
            memberName: grouping.memberName,
            values: values.length ? values : [{label: `Unmapped`, id: ``}]
        }
    })

const getHeatmapXAxisCategories = ({columnHeaders, columnGroupings, experiment, inProxy, atlasUrl, pathToResources}) => {
  if (isMultiExperiment(experiment)) {
    return columnHeaders.map(columnHeader => ({
      label: columnHeader.factorValue,
      id: columnHeader.factorValueOntologyTermId || ``,
      info: {
        trackId: ``,
        tooltip: {},
        groupings: getGroupsThatContainId(columnGroupings, columnHeader.factorValueOntologyTermId || ``)
      }
    }))
  } else if (isDifferential(experiment)) {
    return columnHeaders.map(columnHeader => ({
      label: columnHeader.displayName,
      id: columnHeader.id,
      info: {
        trackId: columnHeader.id,
        tooltip: {
          resources: columnHeader.resources.map(resource => ({
            type: resource.type,
            url: Url.resolve(inProxy + atlasUrl, resource.uri),
            icon: Url.resolve(
              pathToResources,
              Path.basename(require(`../../assets/${resource.type}-icon.png`)))
          })),
          ...columnHeader.contrastSummary
        },
        groupings: []
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
        },
        groupings: getGroupsThatContainId(columnGroupings, columnHeader.factorValueOntologyTermId || ``)
      }
    }))
  }
}

const getHeatmapYAxisCategories = ({rows, geneQuery, experiment, inProxy, atlasUrl}) =>
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
