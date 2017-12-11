import React from 'react'
import { connect } from 'react-refetch'

import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(ReactHighcharts.Highcharts)

import {sortBy} from 'lodash'
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
  tooltip: {
	formatter: function() {
	  return (
		  this.series.name + "<br>" +
		  "Expression fraction per replicate: <br>" +
		  this.point.info.values
		  .map(v => v.id + " " + (Math.round(v.value.expression_as_fraction_of_total * 1000) / 10 ) + "%" ).join("<br>")+
		  "<br> Expression values per replicate: <br>" +
		  this.point.info.values
		  .map(v => v.id + " " + v.value.expression_absolute_units).join("<br>")
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
EXPRESSION_DOMINANCE.ambiguous = `${EXPRESSION_DOMINANCE.dominant}/${EXPRESSION_DOMINANCE.present}`

const COLORS = {}
COLORS[EXPRESSION_DOMINANCE.dominant] = "darkblue"
COLORS[EXPRESSION_DOMINANCE.ambiguous] = "mediumblue"
COLORS[EXPRESSION_DOMINANCE.present] = "lightblue"
COLORS[EXPRESSION_DOMINANCE.absent] = "lightgray"


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

const DominantTranscriptsChart = ({rows,xAxisCategories}) => {
	const dataSeries =
		groupIntoPairs([].concat.apply([], rows.map((r,r_ix) => (r.expressions.map((e, e_ix) =>
		[assignSeries(e),
			{
				x: e_ix,
				y: r_ix,
				value: 1,
				info: e
			}
		])))), `0`)
		.map((a,ix,self)=>({
			name: a[0],
			color: COLORS[a[0]],
			data:a[1]
		}))

	const yAxisCategories = rows.map((r) => (r.name))

	return (
	<div>
	{
		<ReactHighcharts config={dominanceHeatmapConfig({
  		  xAxisCategories,
		  yAxisCategories,
  		  dataSeries: sortBy(dataSeries, '.name')
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
