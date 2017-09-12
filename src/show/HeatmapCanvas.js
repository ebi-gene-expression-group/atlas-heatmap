import React from 'react'
import PropTypes from 'prop-types'
import ReactHighcharts from 'react-highcharts'
import HighchartsHeatmap from 'highcharts/modules/heatmap'
import HighchartsCustomEvents from 'highcharts-custom-events'

const Highcharts = ReactHighcharts.Highcharts
HighchartsHeatmap(Highcharts)
HighchartsCustomEvents(Highcharts)

import hash from 'object-hash'

import {heatmapDataPropTypes, colourAxisPropTypes} from '../manipulate/chartDataPropTypes.js'

// Custom Events default behaviour disables context menu on right-click, we bring it back
window.oncontextmenu = function() {
    return true
}

class HeatmapCanvas extends React.Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        // Callback that does setState fails: https://github.com/kirjs/react-highcharts/issues/245
        // Don’t call render again after zoom happens
        return hash.MD5([nextProps.heatmapData, nextProps.events.onClick, nextProps.withAnatomogram]) !==
               hash.MD5([this.props.heatmapData, this.props.events.onClick, this.props.withAnatomogram])
    }

    _labelsPosition() {
      const containerDivWidth = this.props.withAnatomogram ?
        document.getElementsByClassName(`gxaHeatmapContainer`)[0].clientWidth * 0.80 :
        document.getElementsByClassName(`gxaHeatmapContainer`)[0].clientWidth

      // An upper bound, considering there will be labels to the left, possibly margin to the right of the chart
      const columnWidth = containerDivWidth / this.props.heatmapData.xAxisCategories.length

      const longestColumnLabelLength =
        Math.max(...this.props.heatmapData.xAxisCategories.map(category => category.label.length))

      const columnLabelWidthRatio = longestColumnLabelLength / columnWidth

      if (columnLabelWidthRatio < 0.2) {
        return `horizontal`
      } else if (columnLabelWidthRatio < 0.8) {
        return `rotated`
      } else {
        return `vertical`
      }
    }

    _countColumns() {
        return this.props.heatmapData.xAxisCategories.length
    }

    _getAdjustedMarginRight() {
        // TODO Should add extra margin if labels are slanted and last ones (3 or so?) are very long. See reference_experiment_single_gene.html
        // const initialMarginRight = 60
        // return initialMarginRight * (1 + 10 / Math.pow(1 + this._countColumns(), 2))
      
        if (this._labelsPosition() === `rotated`) {
            return 60
        } else {
            return 20
        }
    }

    _getAdjustedMarginTop() {
        const longestColumnLabelLength =
            Math.max(...this.props.heatmapData.xAxisCategories.map(category => category.label.length))
        const labelsPosition = this._labelsPosition()

        if (labelsPosition === `horizontal`) {
            return 30
        } else if (labelsPosition === `rotated`) {
            return longestColumnLabelLength * 4
        } else { // labelsPosition === `vertical`
            return longestColumnLabelLength * 5
        }
    }

    _getAdjustedHeight(marginTop, marginBottom) {
        const rowsCount = this.props.heatmapData.yAxisCategories.length
        const rowHeight = 40
        return rowsCount * rowHeight + marginTop + marginBottom
    }

    render() {
        // TODO Should the margins be recalculated when the window is resized?
        const marginBottom = 10
        const marginTop = this._getAdjustedMarginTop()
        const marginRight = this._getAdjustedMarginRight()
        const height = this._getAdjustedHeight(marginTop, marginBottom)

        const {cellTooltipFormatter, xAxisFormatter, yAxisFormatter, events, onZoom} = this.props

        const highchartsConfig = {
            chart: {
                marginTop,
                marginBottom,
                marginRight,
                height,
                type: `heatmap`,
                spacingTop: 0,
                plotBorderWidth: 1,
                events: {
                   handleGxaAnatomogramTissueMouseEnter: function (e) {
                     const selectedPoints = this.getSelectedPoints()
                     if (selectedPoints.length > 0) {
                       Highcharts.each(selectedPoints, function (point) {
                         point.select(false)
                       })
                     }

                     Highcharts.each(this.series, function (series) {
                       Highcharts.each(series.points, function (point) {
                         if (e.svgPathIds.includes(point.series.xAxis.categories[point.x].id)) {
                           point.select(true, true)
                         }
                       })
                     })
                   }
                },
                zoomType: `x`
            },

            plotOptions: {
                heatmap: {
                    turboThreshold: 0
                },

                series: {
                    cursor: events.onClick ? `pointer` : undefined,
                    point: {
                        events: {
                            click: events.onClick ? function() { events.onClick(this.x, this.y) } : function() {},
                            mouseOver: function() { events.onHoverPoint(this.x) },
                            mouseOut: function() { events.onHoverOff() }
                        }
                    },

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

            legend: {
                enabled: false
            },

            title: null,

            colorAxis: this.props.colourAxis,

            xAxis: { //assay groups, contrasts, or factors across experiments
                tickLength: 5,
                tickColor: `rgb(192, 192, 192)`,
                lineColor: `rgb(192, 192, 192)`,
                labels: {
                    style: this.props.xAxisStyle,
                    // Events in labels enabled by 'highcharts-custom-events'
                    events: {
                        mouseover: function() {
                          events.onHoverColumnLabel(this.value)
                        },
                        mouseout: function() {
                          events.onHoverOff()
                        }
                    },
                    autoRotation: [-45, -90],
                    formatter: function() {
                        return xAxisFormatter(this.value)
                    }
                },

                opposite: 'true',
                categories: this.props.heatmapData.xAxisCategories,
                min: 0,
                max: this._countColumns() - 1,

                events: {
                    setExtremes: function(event) {
                        onZoom(event.min !== undefined && event.max !== undefined)
                    }
                }
            },

            yAxis: { //experiments or bioentities
                useHTML: true,
                reversed: true,
                labels: {
                    style: this.props.yAxisStyle,
                    events: {
                        mouseover: function() {
                          events.onHoverRowLabel(this.value)
                        },
                        mouseout: function() {
                          events.onHoverOff()
                        }
                    },
                    formatter: function() {
                        return yAxisFormatter(this.value)
                    }
                },

                categories: this.props.heatmapData.yAxisCategories,
                title: null,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                endOnTick: false
            },

            tooltip: {
                useHTML: true,
                shared: false,
                borderRadius: 0,
                borderWidth: 0,
                shadow: false,
                enabled: true,
                backgroundColor: `none`,
                formatter: function() {
                    return cellTooltipFormatter(this.series, this.point)
                }
            },

            series: this.props.heatmapData.dataSeries.map(e => {
                return {
                    name: e.info.name,
                    color: e.info.colour,
                    borderWidth: this._countColumns() > 200 ? 0 : 1,
                    borderColor: `white`,
                    data: e.data
                }
            })
        }

        // const maxWidthFraction = this._countColumns() > 6 ? 1 : Math.max(0.5, 1 - Math.exp(-(1 + 0.05 * Math.pow(1 + this._countColumns(), 2))))
        return (
            <div>
                <ReactHighcharts ref={(ref) => this.highchartsRef = ref} config={highchartsConfig}/>
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
      const chart = this.highchartsRef.getChart()
      Highcharts.fireEvent(chart, `handleGxaAnatomogramTissueMouseEnter`, {svgPathIds: nextProps.ontologyIdsToHighlight})
    }
}

HeatmapCanvas.propTypes = {
    heatmapData: heatmapDataPropTypes.isRequired,
    colourAxis: colourAxisPropTypes,    // Only for experiment heatmap
    cellTooltipFormatter: PropTypes.func.isRequired,
    xAxisFormatter: PropTypes.func.isRequired,
    xAxisStyle: PropTypes.object.isRequired,
    yAxisFormatter: PropTypes.func.isRequired,
    yAxisStyle: PropTypes.object.isRequired,
    ontologyIdsToHighlight: PropTypes.arrayOf(PropTypes.string).isRequired,
    events: PropTypes.shape({
      onHoverRowLabel: PropTypes.func.isRequired,
      onHoverColumnLabel: PropTypes.func.isRequired,
      onHoverPoint: PropTypes.func.isRequired,
      onHoverOff: PropTypes.func.isRequired,
      onClick: PropTypes.func
    }),
    onZoom: PropTypes.func.isRequired,
    withAnatomogram: PropTypes.bool.isRequired
}

const Main = props => (
    props.heatmapData.yAxisCategories.length < 1
    ? <div style={{padding: `50px 0`}}>
        No data match your filtering criteria or your original query. Please, change your query or your filters and try again.
      </div>
    : <HeatmapCanvas {...props} />
)

export default Main
