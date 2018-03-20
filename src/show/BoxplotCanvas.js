import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import {boxplotData as boxplotDataProps} from '../manipulate/chartDataPropTypes.js'
HighchartsMore(ReactHighcharts.Highcharts)

import allowNegativeLog from './HighchartsAllowNegativeLog'
allowNegativeLog(ReactHighcharts.Highcharts)

const BoxplotCanvas = ({titleSuffix, xAxisCategories, boxplotSeries, loosePointsSeries, unit, config:{cutoff}}) => {
  //see also: transcripts colors
  const color = ReactHighcharts.Highcharts.getOptions().colors[0]
  const series = []
  boxplotSeries.length && series.push(
    {
      name: `Observations`,
      data: boxplotSeries,
      color,
      tooltip: {
        headerFormat: '<em>Factor: {point.key}</em><br/>'
      }
    }
  )
  loosePointsSeries.length && series.push(
    {
      name: `Observations`,
      color,
      type: `scatter`,
      data: loosePointsSeries,
      tooltip: {
        headerFormat: '<em>Factor: {point.key}</em><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name} </b> <br/>Expression: {point.y}<br/>'
      }
    }
  )

  const config = {
    chart: {
      type: `boxplot`,
      inverted: true,
      zoomType: `y`,
    },

    plotOptions: {
      boxplot: {
        turboThreshold: 0
      },
      column: {
        dataLabels: {
          crop: false
        }
      },
      series: {
        animation: false,
        states: {
          hover: {
            color: `#eeec38` //#edab12 color cell on mouse over
          },
          select: {
            color: `#eeec38`
          }
        }
      },
    },

    credits: {
      enabled: false
    },

    title: {
      text: `Gene expression – ${titleSuffix}`
    },

    legend: {
      enabled: false
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
      type: `logarithmic`,

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

      title: {
        text: `Expression` + (unit ? ` (${unit})`: ``)
      },

      min:0.1
    },

    series: series
  }

  return <ReactHighcharts config={config} />
}

BoxplotCanvas.propTypes = boxplotDataProps

export default BoxplotCanvas
