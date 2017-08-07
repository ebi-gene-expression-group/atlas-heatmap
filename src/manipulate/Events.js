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

const onClickUseGenomeBrowser = ({heatmapData, currentGenomeBrowser,heatmapConfig: {experiment, atlasUrl}}) => (
    currentGenomeBrowser && experiment && currentGenomeBrowser !== `none`
    ? (x, y) => {
      window.open(URI(experiment.urls.genome_browsers, atlasUrl).addSearch({
        experimentAccession: experiment.accession,
        name: currentGenomeBrowser,
        geneId: heatmapData.yAxisCategories[y].info.trackId,
        trackId: heatmapData.xAxisCategories[x].info.trackId
      }).toString(), `_blank`)
    }
    : undefined
)

const makeEventCallbacks = ({heatmapData, onSelectOntologyIds, currentGenomeBrowser,heatmapConfig}) => {
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

    onClick: onClickUseGenomeBrowser({heatmapData, currentGenomeBrowser, heatmapConfig})
  }
}

export default makeEventCallbacks
