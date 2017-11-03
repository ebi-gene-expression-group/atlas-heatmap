import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import {boxplotData as boxplotDataProps} from '../manipulate/chartDataPropTypes.js'
HighchartsMore(ReactHighcharts.Highcharts)

// Taken from http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/yaxis/type-log-negative/
const allowNegativeLog = (H) => {
  H.Axis.prototype.allowNegativeLog = true;

  // Override conversions
  H.Axis.prototype.log2lin = (num) => {
    const isNegative = num < 0
    let adjustedNum = Math.abs(num)

    if (adjustedNum < 10) {
        adjustedNum += (10 - adjustedNum) / 10
    }

    const result = Math.log(adjustedNum) / Math.LN10
    return isNegative ? -result : result
  }

  H.Axis.prototype.lin2log = (num) => {
    const isNegative = num < 0
    const absNum = Math.abs(num)
    let result = Math.pow(10, absNum)

    if (result < 10) {
        result = (10 * (result - 1)) / (10 - 1)
    }

    return isNegative ? -result : result
  }
}

allowNegativeLog(ReactHighcharts.Highcharts)

const BoxplotCanvas = ({title, xAxisCategories, boxplotSeries,loosePointsSeries, unit}) => {

    const initialMarginRight = 60
    const marginRight = initialMarginRight * (1 + 10 / Math.pow(1 + xAxisCategories.length, 2))

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
            marginRight,
            type: `boxplot`,
            spacingRight: xAxisCategories.slice(-1)[0].length > 6 ? 100 : 0
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
            text: title
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
            // opposite: 'true'
        },

        yAxis: {
            type: `logarithmic`,
            title: {
                text: `Expression` + (unit ? ` (${unit})`: ``)
            },
            // reversed: true
        },

        series: series
    }

    return <ReactHighcharts config={config} />
}

BoxplotCanvas.propTypes = boxplotDataProps

export default BoxplotCanvas
