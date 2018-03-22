import React from 'react'
import { connect } from 'react-refetch'

import ReactHighcharts from 'react-highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
HighchartsMore(ReactHighcharts.Highcharts)

import Color from 'color'
import {unzip, sortBy, groupBy, sum, meanBy} from 'lodash'
import {groupIntoPairs} from '../utils.js'

import Legend from '../manipulate/heatmap-legend/DataSeriesHeatmapLegend'

// SUFFIX is added, then removed, to merge single points with quartiles, otherwise we’d end up with two series: one for
// scatter points and other for boxplots
const SUFFIX = ` individual`

import allowNegativeLog from './HighchartsAllowNegativeLog'
allowNegativeLog(ReactHighcharts.Highcharts)

const expressionPlotConfig = ({titleSuffix, xAxisCategories, config: {cutoff}, dataSeries}) => ({
  chart: {
    ignoreHiddenSeries: false,
    type: `boxplot`,
    inverted: true,
    zoomType: `y`,
    events: {
      load: function() {
        //works apart from when you later take some series out with the menu http://jsfiddle.net/sza4odkz/1/
        this.series.forEach((series, ix, self) => {
          if (series.type === `scatter`) {
            const correspondingBoxplotSeries =
            self.find((otherSeries, otherIx) => otherSeries.name === series.name.replace(SUFFIX, ``) && otherIx !==ix)

            if (correspondingBoxplotSeries) {
              series.data.forEach((point) => {
                point.x =
                correspondingBoxplotSeries.xAxis.toValue(
                  correspondingBoxplotSeries.data[point.x].shapeArgs.x +
                  (correspondingBoxplotSeries.data[point.x].shapeArgs.width / 2) +
                  correspondingBoxplotSeries.group.translateX +
                  (correspondingBoxplotSeries.data[point.x].stem.strokeWidth() % 2 ) / 2)
                })
              }
            }
          })
        }
      }
    },

    title: {
      text: `Expression per transcript – ${titleSuffix}`
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
      type: `logarithmic`,

      plotLines: cutoff > 0.1 ? [{
        value: cutoff,
        dashStyle: `Dash`,
        color: `#333333`,
        width: 1,
        label: {
          text: `Cutoff: ${cutoff}`,
          align: `left`,
          style: {
            color: `gray`
          }
        }
      }] : [],

      title: {
        text: `Expression (TPM)`
      },

      min: 0.1
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
          legendItemClick: ({ target: {name: thisSeriesName, chart} }) => {
            chart.series.forEach(
              s => s.name.replace(SUFFIX, ``) === thisSeriesName.replace(SUFFIX, ``) && (s.visible ? s.hide() : s.show()))
              return false
            }
          }
        },

        scatter: {
          marker: {
            symbol: `circle`,
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
      }
    })

    /*
    color number 0 is used in BoxplotCanvas.js
    if there is only one transcript, use the same color
    otherwise use different colors (tries to be less misleading)
    */
    const colorForSeries =
    (rowIndex, total) => ReactHighcharts.Highcharts.getOptions().colors[total < 2 ? 0 : rowIndex + 1]

    const boxPlotDataSeries = ({rows}) =>
    rows.map(
      ({id, name, expressions}, rowIndex, self) => ({
        name: id,
        color: colorForSeries(rowIndex, self.length),
        data: expressions.map(
          ({values, stats}) =>
          (stats ? [stats.min, stats.lower_quartile, stats.median, stats.upper_quartile, stats.max] : [])
        )
      })
    ).filter(e => e.data.length > 0)

    const scatterDataSeries = ({rows}) =>
    rows.map(
      ({id, name, expressions}, rowIndex, self) => ({
        type: `scatter`,
        name: `${id}${SUFFIX}`,
        color: colorForSeries(rowIndex, self.length),
        data:
        [].concat.apply(
          [],
          expressions.map(
            ({values, stats}, ix) =>
            (values ?
              values.filter(({value}) => value > 0).map(({value, id, assays}) => ({
                x: ix,
                y: value,
                info: {id, assays}})) :
                []
              )
            )
          ),
          marker: {
            lineWidth: 1,
          },
          tooltip: {
            pointFormat: `Expression: {point.y} TPM <br/>Assay: {point.info.assays}`
          },
          showInLegend: false
        })
      )

      const ExpressionChart = ({rows, xAxisCategories, config, titleSuffix}) =>
      <div key={`chart`}>
      {rows.length &&
        <ReactHighcharts
        config={
          expressionPlotConfig({
            titleSuffix,
            config,
            xAxisCategories,
            dataSeries: [].concat(boxPlotDataSeries({rows}))
          })
        }/>
      }
      </div>

      // See: BaselineExpressionPerBiologicalReplicate.dominanceAmongRelatedValues
      const DATA_SERIES = {
        dominant: {
          key: `dominant`,
          name: `Dominant`,
          colour: `rgb(0, 0, 115)`,
          on: true
        },
        ambiguous: {
          key: `ambiguous`,
          name: `Ambiguous`,
          colour: `rgb(0, 85, 225)`,
          on: true
        },
        nonDominant: {
          key: `nonDominant`,
          name: `Non-dominant`,
          colour: `rgb(179, 218, 255)`,
          on: true
        },
        // Not used; we plot missing values with plotBackgroundColor
        absent: {
          key: `absent`
        }
      }

      const dominanceHeatmapConfig = ({titleSuffix, xAxisCategories, yAxisCategories, dataSeries}) => ({
        chart: {
          type: `heatmap`,
          inverted: true,
          plotBackgroundColor: `rgb(235, 235, 235)`,  // Colour for non-expressed transcripts (aka absent)
          plotBorderColor: `darkgray`
        },

        credits: {
          enabled: false
        },

        legend: {
          enabled: false
        },

        title: {
          text: `Dominant transcripts – ${titleSuffix}`
        },

        xAxis: {
          categories: xAxisCategories,
          // Force-display leading and trailing categories, even if they have no data
          min: 0,
          max: xAxisCategories.length - 1
        },

        yAxis: {
          categories: yAxisCategories,
          title: {
            text: ``
          },
        },

        color: `#000000`,

        tooltip: {
          useHTML: true,
          padding: 0,
          formatter: function() {
            const rowHead = (a, b, c, d) => `<tr><th>${a}</th><th>${b}</th><th>${c}</th><th>${d}</th></tr>`
            const rowData = (a, b, c, d) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td><td>${d}</td></tr>`
            return (
              `<table style="margin-bottom: 0;">` +
              `<thead>` +
              rowHead(`Replicate`, `Rel isoform usage`, `Expression`, `Dominant`) +
              `</thead>` +

              `<tbody>` +
              this.point.info.map(
                v =>
                rowData(
                  v.replicate, `${Math.round(v.fractionOfExpression * 1000) / 10} %`, `${v.value} TPM`, v.isDominant)
                ).join(``) +
                `</tbody>` +
                `</table>`
              )
            }
          },

          series: dataSeries
        })

        const assignDataSeries = (values) => {
          if (!values) {
            return DATA_SERIES.absent.key
          }

          return (values.find(v => v.isDominant) ?
          values.every(v => v.isDominant) ? DATA_SERIES.dominant.key : DATA_SERIES.ambiguous.key :
          values.find(v => v.value) ? DATA_SERIES.nonDominant.key : DATA_SERIES.absent.key)
        }

        const DominantTranscriptsChart = ({titleSuffix, rows, xAxisCategories}) => {
          const yAxisCategories = rows.map((r) => (r.name))

          const unrolledRows =
          [].concat.apply(
            [],
            [].concat.apply(
              [],
              rows.map(
                (r, row_ix) =>
                r.expressions.map(
                  (expressionPerReplicate, column_ix) =>
                  !expressionPerReplicate.values ?
                  [] :
                  expressionPerReplicate.values.map(
                    replicate => ({
                      replicate: replicate.assays.join(`, `),
                      x: column_ix,
                      value: replicate.value.expression_absolute_units,
                      y: row_ix
                    })
                  )
                )
              )
            )
          )


          const expressionFractionsPerReplicate =
          [].concat.apply(
            [],
            groupIntoPairs(unrolledRows, o => JSON.stringify({assay_group: o.x, replicate: o.replicate}))
            .map(
              a => {
                const values = a[1].map(x => x.value).sort((a ,b) => b - a)
                const total = sum(values)
                const topValue = values[0]
                const secondValue = values[1]
                const topTranscriptIsDominant = topValue && (!secondValue || topValue > secondValue * 2 )

                return (
                  a[1].map(
                    x => ({
                      ...x,
                      fractionOfExpression: x.value ? x.value / total : 0,
                      isDominant: x.value == topValue && topTranscriptIsDominant
                    })
                  )
                )
              }
            )
          )

          const expressionPerAssayGroupAndTranscript =
          [].concat.apply(
            [],
            groupIntoPairs(expressionFractionsPerReplicate,o => o.x)
            .map(
              a => {
                const x = a[0]
                const allReplicatesForThisAssayGroup =
                a[1].map(e => e.replicate).filter((e, ix, self) => self.indexOf(e) === ix).sort()

                return groupIntoPairs(a[1], o => o.y).map(
                  aa =>  ({
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

                })
              )

              const dataSeries = groupIntoPairs(expressionPerAssayGroupAndTranscript, o => o.series).map(
                a => ({
                  name: a[0],
                  data: a[1].map(
                    e => ({
                      x: +e.x,
                      y: +e.y,
                      value: meanBy(e.info, `fractionOfExpression`),
                      info: e.info})
                    ),
                    color: DATA_SERIES[a[0]].colour
                  })
                )

                return (
                  <div>
                  {
                    <ReactHighcharts config={dominanceHeatmapConfig({
                      titleSuffix,
                      xAxisCategories,
                      yAxisCategories,
                      dataSeries: sortBy(dataSeries, `.name`).reverse()
                    })}/>
                  }
                  </div>
                )
              }

              const Transcripts = ({keepOnlyTheseColumnIds, columnHeaders, rows, display, config, titleSuffix}) => {
                const ixs =
                  columnHeaders
                    .map((e,ix) => [e, ix])
                    .filter((eix) => keepOnlyTheseColumnIds.includes(eix[0].id))
                    .map((eix) => eix[1])

                const xAxisCategories =
                  columnHeaders
                    .filter((e,ix) => ixs.includes(ix))
                    .map(({id,name}) => name || id)

                return (
                  <div>
                    <ExpressionChart titleSuffix={titleSuffix}
                                     config={config}
                                     xAxisCategories={xAxisCategories}
                                     rows={rows.map(
                                       row => ({
                                         ...row,
                                         expressions: row.expressions.filter((e,ix) => ixs.includes(ix))
                                       })
                                     )}/>

                    { false &&
                      <div>
                        <DominantTranscriptsChart titleSuffix={titleSuffix}
                                                  xAxisCategories={xAxisCategories}
                                                  rows={rows}/>

                        <Legend legendItems={Object.keys(DATA_SERIES).map((key) => DATA_SERIES[key]).filter(o => o.name && o.colour)}
                                title={`Dominant: dominant in all samples.\nAmbiguous: dominant in some samples.\nNon-dominant: non-dominant in all samples.`}
                                missingValueColour={`rgb(235, 235, 235)`}
                                missingValueLabel={`Not expressed`}/>
                      </div> }
                  </div>
                )
              }

              export default Transcripts
