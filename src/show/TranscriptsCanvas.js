import React from 'react'
import { connect } from 'react-refetch'

import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(ReactHighcharts.Highcharts)

import {unzip, sortBy, groupBy, sum, meanBy} from 'lodash'
import {groupIntoPairs} from '../utils.js'

const SUFFIX=" individual"

const dominanceHeatmapConfig = ({xAxisCategories, yAxisCategories, dataSeries}) => ({
	chart: {
	  type: `heatmap`
  },
  credits: {
	enabled: false
  },

  legend: {
	enabled: true
  },

  title: {
	  text: 'Dominant transcripts'
  },

  xAxis: {
	  categories: xAxisCategories
  },
  yAxis: {
	  categories: yAxisCategories
  },
  colorAxis: { //lightblue for present but not dominant, plus two tints for "barely present"
	  dataClasses:[{
		  from: 0,
		  to: 0.05,
		  color: '#EAF5F9',
		  name: ''
	  },{
		  from: 0.05,
		  to: 0.15,
		  color: '#E0F0F6',
		  name: ''
	  },
	  {
		  from: 0.15,
		  to: 0.5,
		  color: '#ADD8E6',
		  name: 'present'
	  }]
  },
  tooltip: {
	formatter: function() {
	  return (
		  "Expression value: <br>" +
		  this.point.info
		  .map(v => `${v.replicate} <b>${Math.round(v.fractionOfExpression * 1000) / 10 }% </b> (${v.value} TPM)`).join("<br>")
	  )
	}
  },
  series: dataSeries
})

const expressionPlotConfig = ({xAxisCategories, config: {cutoff}, dataSeries}) => ({
	chart: {
		ignoreHiddenSeries: false,
		type: 'boxplot',
		zoomType: 'x',
		events: {
	      load: function() {
			//works apart from when you later take some series out with the menu
			//http://jsfiddle.net/sza4odkz/1/
			this.series.forEach((series,ix,self) => {
				if(series.type=='scatter'){
					const correspondingBoxplotSeries = self.find((otherSeries, otherIx) =>( otherSeries.name == series.name.replace(SUFFIX,"") && otherIx !==ix))

					if (correspondingBoxplotSeries){
						series.data.forEach((point) => {
							point.x = correspondingBoxplotSeries.xAxis.toValue(correspondingBoxplotSeries.data[point.x].shapeArgs.x + (correspondingBoxplotSeries.data[point.x].shapeArgs.width /2 ) + correspondingBoxplotSeries.group.translateX + (correspondingBoxplotSeries.data[point.x].stem.strokeWidth() % 2 )/2)
						})
					}
				}
			})
	    	}
		}
	},

	title: {
		text: 'Expression per transcript'
	},

	credits: {
		enabled: false
	},

	legend: {
		enabled: true
	},

	xAxis: {
		tickLength: 5,
		tickColor: `rgb(192, 192, 192)`,
		lineColor: `rgb(192, 192, 192)`,
		categories: xAxisCategories,
		labels: {
			style: {
				fontSize: `9px`
			}
		}
	},

	yAxis: {
		title: {
			text: 'Expression (TPM)'
		},
		plotLines: cutoff > 0.1 ? [{
		   value: cutoff,
		   dashStyle: 'Dash',
		   color: '#333333',
		   width: 1,
		   label: {
			   text: `Cutoff: ${cutoff}`,
			   align: 'left',
			   style: {
				   color: 'gray'
			   }
		   }
	   }] : [],

		type:'logarithmic',
		min:0.1
	},

	series: dataSeries,

	plotOptions: {
		column: {
            grouping: false,
            shadow: false,
        },
		series: {
			animation: false,
			events: {
                legendItemClick: ({target:{name:thisSeriesName,chart}}) => {
					chart.series.forEach(s => s.name.replace(SUFFIX,"") === thisSeriesName.replace(SUFFIX,"") && (s.visible ? s.hide(): s.show()))
                    return false;
                }
            }
        },
		scatter: {
		   marker: {
			   symbol: "circle",
			   states: {
				   hover: {
					   enabled: true,
				   }
			   }
		   },
		   states: {
			   hover: {
				   marker: {
					   enabled: false
				   }
			   }
		   }
	   }
	},
})

/*
color number 0 is used in BoxplotCanvas.js
if there is only one transcript, use the same color
otherwise use different colors (tries to be less misleading)
*/
const colorForSeries = (rowIndex, total) => ReactHighcharts.Highcharts.getOptions().colors[total < 2 ? 0 : rowIndex+1]

const boxPlotDataSeries = ({rows}) => (
	rows.map(({id, name, expressions}, rowIndex, self) => ({
		name: id,
		color: colorForSeries(rowIndex, self.length),
		data: expressions.map(
					({values, stats}) =>(
				stats
				? [stats.min, stats.lower_quartile, stats.median, stats.upper_quartile, stats.max]
				: []
			))
	}))
)

const scatterDataSeries = ({rows}) => { return (
	rows.map(({id, name, expressions},rowIndex, self) => ({
		type: 'scatter',
		name: id+SUFFIX,
		color: colorForSeries(rowIndex,self.length),
		data:
		  [].concat.apply([],
			 expressions.map(({values, stats}, ix) =>(
			  values
			  ? values
				  .filter(({value})=> value >0)
				  .map(({value, id, assays})=>({
					  x:ix,
					  y:value,
					  info: {id, assays}
				  }))
			  : []
			))),
		marker: {
		   lineWidth: 1,
		},
		tooltip: {
		   pointFormat: 'Expression: {point.y} TPM <br/> Assay:  {point.info.assays}'
	   },
	   showInLegend: false

	}))
)}

const ExpressionChart = ({rows,xAxisCategories, config}) => (
  	<div>
	<br/>
	<div key={`chart`}>
	  {rows.length && <ReactHighcharts config={expressionPlotConfig({
		  config,
		  xAxisCategories,
		  dataSeries:
			  [].concat(
				  boxPlotDataSeries({rows})
			  ).concat(
				  scatterDataSeries({rows})
			  )
	  })}/>}
	</div>
  </div>
)

// See: BaselineExpressionPerBiologicalReplicate.dominanceAmongRelatedValues
const EXPRESSION_DOMINANCE = {
	dominant: "dominant",
	present: "present",
	absent: "absent"
}
EXPRESSION_DOMINANCE.ambiguous = `ambiguous`

const COLORS = {}
COLORS[EXPRESSION_DOMINANCE.dominant] = "darkblue"
COLORS[EXPRESSION_DOMINANCE.ambiguous] = "mediumblue"
//use global color axis
COLORS[EXPRESSION_DOMINANCE.present] = "lightblue"
COLORS[EXPRESSION_DOMINANCE.absent] = "white" //not used


const assignSeries = ({values}) => {
	if(!values){
		return EXPRESSION_DOMINANCE.absent;
	}
	const hasAllDominant = values.every(v => v.value.expression_dominance == EXPRESSION_DOMINANCE.dominant )
	const hasDominant = values.find(v => v.value.expression_dominance == EXPRESSION_DOMINANCE.dominant )
	const hasPresent = values.find(v => v.value.expression_dominance == EXPRESSION_DOMINANCE.present )

	return (
		hasDominant
		? hasAllDominant
			? EXPRESSION_DOMINANCE.dominant
			: EXPRESSION_DOMINANCE.ambiguous
		: hasPresent
			? EXPRESSION_DOMINANCE.present
			: EXPRESSION_DOMINANCE.absent
	)
}

const assignDataSeries = (values) => (
  values.find(v=> v.isDominant)
	? values.every(v => v.isDominant)
		? EXPRESSION_DOMINANCE.dominant
		: EXPRESSION_DOMINANCE.ambiguous
	: values.find(v => v.value)
		? EXPRESSION_DOMINANCE.present
		: EXPRESSION_DOMINANCE.absent
)


const DominantTranscriptsChart = ({rows,xAxisCategories}) => {

	const yAxisCategories = rows.map((r) => (r.name))

	const unrolledRows = [].concat.apply([], [].concat.apply([], rows.map((r, row_ix) =>
		r.expressions.map((expressionPerReplicate, column_ix) => !expressionPerReplicate.values ? [] : expressionPerReplicate.values.map(replicate => ({
		    replicate: replicate.id,
		    x: column_ix,
		    value: replicate.value.expression_absolute_units,
		    y: row_ix
	}))))))


  const expressionFractionsPerReplicate = [].concat.apply([], groupIntoPairs(unrolledRows, o => JSON.stringify({assay_group: o.x, replicate: o.replicate})).map(a => {
	  const values = a[1].map(x => x.value).sort((a,b)=>b-a)
	  const total = sum(values)
	  const topValue = values[0]
	  const secondValue = values[1]
	  const topTranscriptIsDominant = topValue && (!secondValue || topValue > secondValue * 2 )
	  return (
		  a[1]
		  .map(x => Object.assign({}, x, {
			  value: x.value,
			  fractionOfExpression: x.value ? x.value / total : 0,
			  isDominant: x.value == topValue && topTranscriptIsDominant
		  }))
	  )
  }))

  const expressionPerAssayGroupAndTranscript =
	  [].concat.apply([], groupIntoPairs(
			expressionFractionsPerReplicate,
			o => o.x
		).map(a => {
			const x = a[0]
			const allReplicatesForThisAssayGroup = a[1].map(e => e.replicate).filter((e,ix,self)=> self.indexOf(e)==ix).sort()

			return (
				groupIntoPairs(
					a[1],
					o => o.y
				).map (aa =>  ({
				  x: a[0],
				  y: aa[0],
				  series: assignDataSeries(aa[1]),
				  info: allReplicatesForThisAssayGroup.map(replicate => (
					  aa[1].find(e => e.replicate == replicate) || {
					  replicate: replicate,
					  isDominant:false,
					  value: 0,
					  fractionOfExpression: 0
				  }))
			  })
			)
		  )
		})
  )

  const dataSeries = groupIntoPairs(
	  expressionPerAssayGroupAndTranscript,
	  o => o.series
  ).map(a => Object.assign({
	  name: a[0],
	  data:a[1].map(e => { return {x: +e.x, y: +e.y, value: meanBy(e.info, 'fractionOfExpression'), info: e.info}}),
	  color: COLORS[a[0]],

  }, a[0] == EXPRESSION_DOMINANCE.present ? {} : {
	  colorAxis: false,
  } ))
	return (
	<div>
	{
		<ReactHighcharts config={dominanceHeatmapConfig({
  		  xAxisCategories,
		  yAxisCategories,
  		  dataSeries: sortBy(dataSeries, '.name').reverse()
  	  })}/>
	}
	</div>
)
}
const Transcripts = ({keepOnlyTheseColumnIds, columnHeaders, rows, display, config}) => {

	const ixs =
		columnHeaders
		.map((e,ix) => [e, ix])
		.filter((eix) => keepOnlyTheseColumnIds.includes(eix[0].id))
		.map((eix) => eix[1])

	const xAxisCategories =
		columnHeaders
		.filter((e,ix) => ixs.includes(ix))
		.map(({id,name})=>name || id)

	return ( !!display &&
		<div>
			<ExpressionChart
				config={config}
				xAxisCategories={xAxisCategories}
				rows={rows.map(row => Object.assign(row, {expressions: row.expressions.filter((e,ix) => ixs.includes(ix))}))}
				/>
			<DominantTranscriptsChart
				config={config}
				xAxisCategories={xAxisCategories}
				rows={rows}

			/>
		</div>
	)
}

export default Transcripts
