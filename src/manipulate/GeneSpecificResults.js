import React from 'react'
import { connect } from 'react-refetch'

import Boxplot from '../show/BoxplotCanvas.js'
import Transcripts from '../show/TranscriptsCanvas.js'


const tryCreateBoxplotData = ({dataRow, columnHeaders}) => {
  const boxplotSeries =
    [].concat.apply([],
      dataRow.expressions
      .map((expression, ix) => (
        expression.quartiles
        ? [{
            x: ix,
            low: expression.quartiles.min,
            q1: expression.quartiles.lower,
            median: expression.quartiles.median,
            q3: expression.quartiles.upper,
            high: expression.quartiles.max
          }]
        : []
      ))
    )

  const loosePointsSeries =
    [].concat.apply([],
      dataRow.expressions
      .map((expression, ix) => (
        expression.quartiles
        ? []
        : [{x:ix, y: expression.value}]
      ))
    )

  if(boxplotSeries.length || loosePointsSeries.length){
    return {
        boxplotSeries,
        loosePointsSeries,
        xAxisCategories: columnHeaders.map((header) => header.name),
        unit: dataRow.expressionUnit
    }
  } else {
    return null
  }
}

const noData = (msg) => <span>{msg}</span>

const makeBoxplot = (geneNameOrId, data, config) => (
    data && config && <Boxplot {...data} config={config} titleSuffix={geneNameOrId} />
)

const getGeneNameOrId = ({name, id}) => name ? name : id

const QuietLoader = ({sourceUrlFetch, keepOnlyTheseColumnIds}) => (
  sourceUrlFetch.pending
  ? noData()
  : sourceUrlFetch.rejected
  ? noData(sourceUrlFetch)
  : ! sourceUrlFetch.fulfilled
  ? noData(sourceUrlFetch)
  : sourceUrlFetch.value.error
  ? noData(sourceUrlFetch.value.error)
  : (! sourceUrlFetch.value.geneExpression && ! sourceUrlFetch.value.transcriptExpression)
  ? noData(sourceUrlFetch.value)
  : (
  <div>
  { sourceUrlFetch.value.geneExpression &&
              makeBoxplot(
                getGeneNameOrId(sourceUrlFetch.value.geneExpression.rows[0]),
                tryCreateBoxplotData(
                  {
                    dataRow: sourceUrlFetch.value.geneExpression.rows[0],
                    columnHeaders: sourceUrlFetch.value.columnHeaders
                  }),
                  sourceUrlFetch.value.config)
  }
  { sourceUrlFetch.value.transcriptExpression &&
  <Transcripts {... sourceUrlFetch.value.transcriptExpression}
                           keepOnlyTheseColumnIds = {keepOnlyTheseColumnIds}
                           columnHeaders = {sourceUrlFetch.value.columnHeaders}
                           config = {sourceUrlFetch.value.config}
                           titleSuffix = {getGeneNameOrId(sourceUrlFetch.value.geneExpression.rows[0])} />
  }
  </div>
  )
)

export default connect(props => ({
    sourceUrlFetch: {
        url: props.url
    },
}))(QuietLoader)
