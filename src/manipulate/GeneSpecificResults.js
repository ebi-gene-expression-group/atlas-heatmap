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

  if(boxplotSeries.length){
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

const noData = (msg) => {
	msg && console.log(msg)
	return <span/>
}

const title = ({name, id}) => (
    <h3>
        {name === id ? name : `${name} - ${id}`}
    </h3>
)
const makeBoxplot = (data, config ) => (
    data && config && <Boxplot {...data} config={config} />
)

const QuietLoader = ({sourceUrlFetch, keepOnlyTheseColumnIds, shouldDisplayHackForNotTriggeringTheLoadEventUntilChartIsActuallyVisible}) => (
	sourceUrlFetch.pending
	? noData()
	: sourceUrlFetch.rejected
		? noData(sourceUrlFetch)
		: ! sourceUrlFetch.fulfilled
			? noData(sourceUrlFetch)
			: sourceUrlFetch.value.error
				? noData(sourceUrlFetch.value.error)
				: (! sourceUrlFetch.value.geneExpression || ! sourceUrlFetch.value.transcriptExpression)
					? noData(sourceUrlFetch.value)
					: (
						<div>
                        {
                            title(sourceUrlFetch.value.geneExpression.rows[0])
                        }
						{ sourceUrlFetch.value.geneExpression && makeBoxplot(
                            tryCreateBoxplotData({
								dataRow: sourceUrlFetch.value.geneExpression.rows[0],
								columnHeaders: sourceUrlFetch.value.columnHeaders}),
                            sourceUrlFetch.value.config)
						}
						{ sourceUrlFetch.value.transcriptExpression &&
							<Transcripts {...{keepOnlyTheseColumnIds, display: shouldDisplayHackForNotTriggeringTheLoadEventUntilChartIsActuallyVisible}}  {... sourceUrlFetch.value.transcriptExpression} columnHeaders={sourceUrlFetch.value.columnHeaders} config={sourceUrlFetch.value.config}/>
						}
						</div>
					)
)

export default connect(props => ({
    sourceUrlFetch: {
        url: props.url
    },
}))(QuietLoader)
