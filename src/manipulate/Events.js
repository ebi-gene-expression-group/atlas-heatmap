import {curry} from 'lodash'

const _ontologyIdsForColumn = (heatmapData, x) => (
  heatmapData.xAxisCategories[x].id
)

const _ontologyIdsForRow = (heatmapData, y) => (
  [].concat.apply([],
      [].concat.apply([],
          heatmapData
          .dataSeries
          .map(series => series.data)
      )
      .filter(point => point.y === y && !!point.value)
      .map(point => _ontologyIdsForColumn(heatmapData, point.x))
      .map(e => Array.isArray(e) ? e : [e])
  )
  .filter((e,ix,self) => self.indexOf(e) === ix)
)



const makeCallbacks = ({heatmapData,onSelectOntologyIds,genomeBrowserTemplate}) => {
  const ontologyIdsForRow = curry(_ontologyIdsForRow,2)(heatmapData)
  const ontologyIdsForColumn = curry(_ontologyIdsForColumn,2)(heatmapData)
  return {
    onHoverRow: ({y}) => {
      onSelectOntologyIds(ontologyIdsForRow(y))
    },

    onHoverColumn: ({x}) => {
      onSelectOntologyIds(ontologyIdsForColumn(x))
    },

    onHoverOff: () => {
      onSelectOntologyIds([])
    },

    onClickPoint: genomeBrowserTemplate ? ({x, y}) => {
      const xId = heatmapData.xAxisCategories[x].info.trackId;
      const yId = heatmapData.yAxisCategories[y].info.trackId;

      window.open(genomeBrowserTemplate.replace(/_x_/g, xId).replace(/_y_/g, yId), "_blank");
    } : undefined
  }
}

export default makeCallbacks
