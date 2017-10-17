import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
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

const BoxplotCanvas = ({title, xAxisCategories, dataSeries, unit}) => {

    const initialMarginRight = 60
    const marginRight = initialMarginRight * (1 + 10 / Math.pow(1 + xAxisCategories.length, 2))

    // We need to filter because Mat.min(undefined, <any number or anything whatsoever>) returns NaN
    const min = Math.min(...dataSeries.filter(quartiles => quartiles.length).map(quartiles => quartiles[0]))
    const max = Math.max(...dataSeries.filter(quartiles => quartiles.length).map(quartiles => quartiles[4]))

    // If no all five points are the same and we want to show the box plot with just points
    // const scatter = dataSeries.every(quartiles => _.uniq(quartiles).length === 1)

    const series = {
        name: `Observations`,
        data: dataSeries,
        tooltip: {
            headerFormat: '<em>Factor: {point.key}</em><br/>'
        }
    }

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
                states: {
                    hover: {
                        color: `#eeec38` //#edab12 color cell on mouse over
                    },
                    select: {
                        color: `#eeec38`
                    }
                }
            }
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
            min: min,
            max: max,
            // reversed: true
        },

        series: [series]
    }

    return <ReactHighcharts config={config} />
}

BoxplotCanvas.propTypes = {
    title: PropTypes.string.isRequired,
    xAxisCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    dataSeries: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    unit: PropTypes.string.isRequired
}

export default BoxplotCanvas
