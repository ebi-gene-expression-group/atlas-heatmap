import React from 'react'
import { connect } from 'react-refetch'

import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(ReactHighcharts.Highcharts)

const SUFFIX=" individual"

const baseConfig = ({xAxisCategories}) => ({
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
		text: 'Transcripts'
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
		type:'logarithmic',
		min:0.1
	}
	,


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
const plotConfig = ({xAxisCategories, dataSeries}) => Object.assign(
	baseConfig({xAxisCategories}),{
    series: dataSeries
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

const Chart = ({rows,columnHeaders}) => (
  	<div>
	<br/>
	<div key={`chart`}>
	  {rows.length && <ReactHighcharts config={plotConfig({
		  xAxisCategories: columnHeaders.map(({id,name})=>name || id),
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

const Transcripts = ({keepOnlyTheseColumnIds, columnHeaders, rows, display}) => {

	const ixs =
		columnHeaders
		.map((e,ix) => [e, ix])
		.filter((eix) => keepOnlyTheseColumnIds.includes(eix[0].id))
		.map((eix) => eix[1])

	return ( !!display &&
		<div>
			<Chart
				columnHeaders={columnHeaders.filter((e,ix) => ixs.includes(ix))}
				rows={rows.map(row => Object.assign(row, {expressions: row.expressions.filter((e,ix) => ixs.includes(ix))}))}
				/>
		</div>
	)
}

export default Transcripts
