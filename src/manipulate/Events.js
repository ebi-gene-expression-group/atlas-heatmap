import sanitizeHtml from 'sanitize-html'
import URI from 'urijs'

const noTags = {
  allowedTags:[],
  allowedAttributes:[]
}

const onlyUnique = (e, i, arr) => arr.indexOf(e) === i

const _ontologyIdsForColumnIndex = (heatmapData, x) => [heatmapData.xAxisCategories[x].id]

const _ontologyIdsForColumnLabel = (heatmapData, lbl) => [heatmapData.xAxisCategories.find((cat) => cat.label === lbl).id]

const _ontologyIdsForRowIndex = (heatmapData, y) => (
  [].concat.apply([],
      [].concat.apply([],
          heatmapData
          .dataSeries
          .map(series => series.data)
      )
      .filter(point => point.y === y && !!point.value)
      .map(point => _ontologyIdsForColumnIndex(heatmapData, point.x))
      .map(e => Array.isArray(e) ? e : [e])
  )
  .filter(onlyUnique)
)

const makeEventCallbacks = ({heatmapData, onSelectOntologyIds, genomeBrowser, experimentAccession, accessKey, atlasUrl}) => {
  return {
    onHoverRowLabel: (yAxisLabel) => {
      const rowIndex = heatmapData.yAxisCategories.findIndex((cat) => cat.label === sanitizeHtml(yAxisLabel, noTags))
      onSelectOntologyIds(_ontologyIdsForRowIndex(heatmapData, rowIndex))
    },

    onHoverColumnLabel: (xAxisLabel) => {
      const columnIndex = heatmapData.xAxisCategories.findIndex((cat) => cat.label === xAxisLabel)
      onSelectOntologyIds(_ontologyIdsForColumnIndex(heatmapData, columnIndex))
    },

    onHoverPoint: (x) => {
      onSelectOntologyIds(_ontologyIdsForColumnIndex(heatmapData, x))
    },

    onHoverOff: () => {
      onSelectOntologyIds([])
    },

    /*
      For this to work genomeBrowser needs to be included in the props that cause a re-render in HeatmapCanvas.jsx

      TODO we have suffered a bit of a defeat here because it made us include accessKey.
      If instead of genomeBrowser string we had a {name, uri} here, we could do
      URI(genomeBrowser.uri, atlasUrl).search({
        experimentAccession: experimentAccession,
        geneId: heatmapData.xAxisCategories[x].info.trackId,
        trackId: heatmapData.yAxisCategories[y].info.trackId
      })
    */
    onClick: genomeBrowser !== `none` ?
      (x, y) => {
        window.open(URI(`external-services/genome-browser/${genomeBrowser}`, atlasUrl).search({
          experimentAccession: experimentAccession,
          geneId: heatmapData.yAxisCategories[y].info.trackId,
          trackId: heatmapData.xAxisCategories[x].info.trackId,
          accessKey: accessKey
        }).toString(), `_blank`)
      } :
      undefined
  }
}

export default makeEventCallbacks
