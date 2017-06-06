import URI from 'urijs'

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



const makeEventCallbacks = ({heatmapData, onSelectOntologyIds, genomeBrowser, experimentAccession, accessKey, atlasUrl}) => {
  return {
    onHoverRow: (y) => {
      onSelectOntologyIds(_ontologyIdsForRow(heatmapData, y))
    },

    onHoverColumn: (x) => {
      onSelectOntologyIds(_ontologyIdsForColumn(heatmapData, x))
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
          geneId: heatmapData.yAxisCategories[x].info.trackId,
          trackId: heatmapData.xAxisCategories[y].info.trackId,
          accessKey: accessKey
        }).toString(), `_blank`);
      } :
      undefined
  }
}

export default makeEventCallbacks
