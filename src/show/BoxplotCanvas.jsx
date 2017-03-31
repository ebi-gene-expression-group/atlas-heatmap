import React from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(ReactHighcharts.Highcharts);

const BoxplotCanvas = props => {

    const initialMarginRight = 60;
    const marginRight = initialMarginRight * (1 + 10 / Math.pow(1 + props.categories.length, 2));

    // We need to filter because Mat.min(undefined, <any number or anything whatsoever>) returns NaN
    const min = Math.min(...props.seriesData.filter(quartiles => quartiles.length).map(quartiles => quartiles[0]));
    const max = Math.max(...props.seriesData.filter(quartiles => quartiles.length).map(quartiles => quartiles[4]));

    // If no all five points are the same and we want to show the box plot with just points
    // const scatter = props.seriesData.every(quartiles => _.uniq(quartiles).length === 1);

    const series = {
        name: `Observations`,
        data: props.seriesData,
        tooltip: {
            headerFormat: '<em>Factor {point.key}</em><br/>'
        }
    };

    const config = {
        chart: {
            marginRight,
            type: `boxplot`,
            spacingRight: props.categories.slice(-1)[0].length > 6 ? 100 : 0
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
            text: props.title
        },

        legend: {
            enabled: false
        },

        xAxis: {
            tickLength: 5,
            tickColor: `rgb(192, 192, 192)`,
            lineColor: `rgb(192, 192, 192)`,
            categories: props.categories,
            labels: {
                style: {
                    fontSize: `9px`
                }
            }
            // opposite: 'true'
        },

        yAxis: {
            title: {
                text: `Expression (${props.unit})`
            },
            min: min,
            max: max,
            // reversed: true
        },

        series: [series]
    };

    return <ReactHighcharts config={config} />;
};

BoxplotCanvas.propTypes = {
    title: React.PropTypes.string.isRequired,
    categories: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    seriesData: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)).isRequired,
    unit: React.PropTypes.string.isRequired
};

export default BoxplotCanvas;