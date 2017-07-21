import sanitizeHtml from 'sanitize-html'
import URI from 'urijs'

const noTags = {
  allowedTags:[],
  allowedAttributes:[]
}

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
  .filter((e,ix,self) => self.indexOf(e) === ix)
)

const _ontologyIdsForRowLabel = (heatmapData, lbl) => {
  const rowIndex = heatmapData.yAxisCategories.findIndex((cat) => cat.label === lbl)
  return _ontologyIdsForRowIndex(heatmapData, rowIndex)
}

const makeEventCallbacks = ({heatmapData, onSelectOntologyIds, genomeBrowser, experimentAccession, accessKey, atlasUrl}) => {
  return {
    onHoverRow: (y) => {
      typeof y === `number` ?
        onSelectOntologyIds(_ontologyIdsForRowIndex(heatmapData, y)) :
        onSelectOntologyIds(_ontologyIdsForRowLabel(heatmapData, sanitizeHtml(y, noTags)))
    },

    onHoverColumn: (x) => {
      typeof x === `number` ?
        onSelectOntologyIds(_ontologyIdsForColumnIndex(heatmapData, x)) :
        onSelectOntologyIds(_ontologyIdsForColumnLabel(heatmapData, x))
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
