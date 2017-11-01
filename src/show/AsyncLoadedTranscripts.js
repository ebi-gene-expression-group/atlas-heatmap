import React from 'react'
import { connect } from 'react-refetch'
import PropTypes from 'prop-types'

import URI from 'urijs'

import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(ReactHighcharts.Highcharts)
import uncontrollable from 'uncontrollable'

const SUFFIX=" individual"

const baseConfig = ({xAxisCategories,useLogarithmicAxis,pointShape}) => ({
	chart: {
		marginRight : 60 * (1 + 10 / Math.pow(1 + xAxisCategories.length, 2)),
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
		categories: xAxisCategories,
		title: {
			text: 'Assay group'
		}
	},

	yAxis: {
		title: {
			text: 'Expression (TPM)'
		},
		type: useLogarithmicAxis?'logarithmic':'',
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
                legendItemClick: function () {
                        return false;
                }
            }
        },
		scatter: {
		   marker: {
			   symbol: pointShape,
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
const boxPlotConfig = ({xAxisCategories, dataSeries,useLogarithmicAxis}) => Object.assign(
	baseConfig({xAxisCategories,useLogarithmicAxis}),{
    series: dataSeries
})

//TODO tooltip
const plotConfig = ({xAxisCategories, dataSeries,useLogarithmicAxis, pointShape}) => Object.assign(
	baseConfig({xAxisCategories,useLogarithmicAxis,pointShape}),{
    series: dataSeries
})

const scatterPlotConfig = ({xAxisCategories, dataSeries,useLogarithmicAxis}) => Object.assign(
	baseConfig({xAxisCategories,useLogarithmicAxis}),{
    series: dataSeries,
	tooltip: {
        pointFormat: 'Expression: {point.y} TPM <br/> Assay:  {point.info.assays}'
    }
})

const SelectTranscripts = ({rowNames,currentRowNames, onChangeCurrentRowNames}) => (
	<ReactSelect
	name=""
	options={rowNames.map(name => ({label:name, value:name}))}
	multi={true}
	onChange={x => {onChangeCurrentRowNames(x.map(xx=> xx.value))}}
	value={currentRowNames}
	/>
)

const boxPlotDataSeries = ({rows}) => (
	rows.map(({id, name, expressions}) => ({
		name: id,
		data: expressions.map(
					({values, stats}) =>(
				stats
				? [stats.min, stats.lower_quartile, stats.median, stats.upper_quartile, stats.max]
				: []
			))
	}))
)
const BoxPlot = ({rows,columnHeaders,useLogarithmicAxis}) => (
	<div key={`boxPlot`}>
	  {rows.length && <ReactHighcharts config={boxPlotConfig({
		  useLogarithmicAxis,
		  xAxisCategories: columnHeaders.map(({id, name})=>name || id),
		  dataSeries: boxPlotDataSeries({rows})
	  })}/>}
	</div>
)

const scatterDataSeries = ({rows, useLogarithmicAxis}) => { return (
	rows.map(({id, name, expressions},rowIndex) => ({
		type: 'scatter',
		name: id+SUFFIX,
		color: ReactHighcharts.Highcharts.getOptions().colors[rowIndex],
		data:
		  [].concat.apply([],
			 expressions.map(({values, stats}, ix) =>(
			  values
			  ? values
				  .filter(({value})=> !useLogarithmicAxis || value >0)
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

const ScatterPlot = ({rows,columnHeaders,useLogarithmicAxis}) => (
	<div key={`scatterPlot`}>
	  {rows.length && <ReactHighcharts config={scatterPlotConfig({
		  useLogarithmicAxis,
		  xAxisCategories: columnHeaders.map(({id,name})=>name || id),
		  dataSeries: scatterDataSeries({rows,useLogarithmicAxis})
	  })}/>}
	</div>
)
const DISPLAY_PLOT_TYPE = {
	BOX:1, SCATTER:2, BOTH:3
}

const _Chart = ({rows,columnHeaders,toDisplay, onChangeToDisplay,useLogarithmicAxis,onChangeUseLogarithmicAxis,pointShape, onChangePointShape }) => (
  	<div>
	<br/>
	<div key={`chart`}>
	  {rows.length && <ReactHighcharts config={plotConfig({
		  pointShape,
		  useLogarithmicAxis,
		  xAxisCategories: columnHeaders.map(({id})=>id),
		  dataSeries:
			  [].concat(
				  toDisplay == DISPLAY_PLOT_TYPE.SCATTER ? [] : boxPlotDataSeries({rows})
			  ).concat(
				  toDisplay == DISPLAY_PLOT_TYPE.BOX ? [] : scatterDataSeries({rows,useLogarithmicAxis})
			  )
	  })}/>}
	</div>
  </div>
)

const Chart = uncontrollable(_Chart, {toDisplay: 'onChangeToDisplay',useLogarithmicAxis:'onChangeUseLogarithmicAxis', pointShape:"onChangePointShape" })

Chart.defaultProps = {
	defaultToDisplay: DISPLAY_PLOT_TYPE.BOTH,
	defaultUseLogarithmicAxis:true,
	defaultPointShape: "circle"
}

const Transcripts = ({columnHeaders, profiles:{rows}}) => (
	<div>
		<Chart columnHeaders={columnHeaders} rows={rows} />
	</div>
)

const noData = (msg) => {
	msg && console.log(msg)
	return <span/>
}

const QuietTranscriptsLoader = ({sourceUrlFetch}) => (
	sourceUrlFetch.pending
	? noData()
	: sourceUrlFetch.rejected
		? noData(sourceUrlFetch)
		: ! sourceUrlFetch.fulfilled
			? noData(sourceUrlFetch)
			: sourceUrlFetch.value.error
				? noData(sourceUrlFetch.value.error)
				: (! sourceUrlFetch.value.profiles || ! sourceUrlFetch.value.columnHeaders)
					? noData(sourceUrlFetch.value)
					: <Transcripts {... sourceUrlFetch.value} />
)

export default connect(props => ({
    sourceUrlFetch: {
        url: props.url
    },
}))(QuietTranscriptsLoader)

class Demo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      data:{}
    }

    this._handleChangeExperiment = this._handleChangeExperiment.bind(this)
    this._handleChangeGeneId = this._handleChangeGeneId.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleChangeExperiment(event) {
    this.setState({
      experimentAccession: event.target.value
    })
  }
  _handleChangeGeneId(event) {
    this.setState({
      geneId: event.target.value
    })
  }

  _handleSubmit(event) {
    event.preventDefault()
    const url = ourUrl("https://www-test.ebi.ac.uk/gxa/", this.state.experimentAccession, this.state.geneId)

    this.setState({
      url: url,
      loading:true,
  }, fetchResponseJson.bind(this, url, (data) => this.setState({data:data, loading: false})))
  }


  render() {
    return(
      <div className={`row column`}>
        <div className={`row column`}>
          <form onSubmit={this._handleSubmit}>
            <label>Experiment</label>
            <input type={`text`} onChange={this._handleChangeExperiment} value={this.state.experimentAccession}/>
            <label>Gene id</label>
            <input type={`text`} onChange={this._handleChangeGeneId} value={this.state.geneId}/>
            <input className={`button`} type="submit" value="Go!" />
          </form>
        </div>

        { this.state.loading
            ?  ""
            : this.state.url
                ? <div>
                        <i>
                        Reading from:
                        {this.state.url}
                        </i>
                        <br/>
                        <Main {...this.state.data}/>
                    </div>
                : ""

        }
      </div>
    )
  }
}
