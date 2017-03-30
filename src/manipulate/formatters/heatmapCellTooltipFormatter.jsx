import React from 'react';
import ReactDOMServer from 'react-dom/server';

import HeatmapCellTooltip from './HeatmapCellTooltip.jsx';

import escapedHtmlDecoder from 'he';
const reactToHtml = component => escapedHtmlDecoder.decode(ReactDOMServer.renderToStaticMarkup(component));

export default config => {
    return function(series, point) {
        const o = {
            colour: point.color,
            xLabel: point.options.info.xLabel || series.xAxis.categories[point.x].label,
            yLabel: series.yAxis.categories[point.y].label,
            value:  point.value,
        };

        Object.keys(point.options.info).forEach(key => o[key] = point.options.info[key]);

        return reactToHtml(<HeatmapCellTooltip {...o} config={config}/>);
    }
};