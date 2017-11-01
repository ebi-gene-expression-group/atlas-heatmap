import React from 'react'
import { connect } from 'react-refetch'

import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(ReactHighcharts.Highcharts)

const SUFFIX=" individual"

const baseConfig = ({xAxisCategories}) => ({
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
                legendItemClick: function () {
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

const scatterDataSeries = ({rows}) => { return (
	rows.map(({id, name, expressions},rowIndex) => ({
		type: 'scatter',
		name: id+SUFFIX,
		color: ReactHighcharts.Highcharts.getOptions().colors[rowIndex],
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

const Transcripts = ({keepOnlyTheseColumnIds, columnHeaders, profiles:{rows}}) => {

	const ixs =
		columnHeaders
		.map((e,ix) => [e, ix])
		.filter((eix) => keepOnlyTheseColumnIds.includes(eix[0].id))
		.map((eix) => eix[1])

	return (
		<div>
			<Chart
				columnHeaders={columnHeaders.filter((e,ix) => ixs.includes(ix))}
				rows={rows.map(row => Object.assign(row, {expressions: row.expressions.filter((e,ix) => ixs.includes(ix))}))}
				/>
		</div>
	)
}
const noData = (msg) => {
	msg && console.log(msg)
	return <span/>
}

const QuietTranscriptsLoader = ({sourceUrlFetch, keepOnlyTheseColumnIds}) => (
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
					: <Transcripts {...{keepOnlyTheseColumnIds}}  {... sourceUrlFetch.value} />
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
