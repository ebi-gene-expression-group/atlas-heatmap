/*
 This module returns functions that take in labels of rows/columns,
 and return content as it should appear in tooltip.
 */
import React from 'react';

import FactorTooltip from './FactorTooltip.jsx';
import ContrastTooltip from './ContrastTooltip.jsx';
import GeneTooltip from './GeneTooltip.jsx';

import './Tooltips.less';


const createColumnLabelTooltipRenderer = (heatmapConfig, xAxisCategories) => {
    if(!heatmapConfig.experiment) {
        return () => null;
    }

    const tooltipDataPerHeader = {};
    for (let i = 0 ; i < xAxisCategories.length ; i++) {
        if (xAxisCategories[i].info.tooltip) {
            tooltipDataPerHeader[xAxisCategories[i].label] = xAxisCategories[i].info.tooltip;
        }
    }
    Object.freeze(tooltipDataPerHeader);

    return function(columnIndex) {
        const columnHeader = xAxisCategories[columnIndex];
        return (
            columnHeader && columnHeader.label && tooltipDataPerHeader.hasOwnProperty(columnHeader.label) ?
                heatmapConfig.isDifferential ?
                    <ContrastTooltip {...tooltipDataPerHeader[columnHeader.label]} /> :
                    <FactorTooltip {...tooltipDataPerHeader[columnHeader.label]}/>
                : null
        );
    }
};

const createRowLabelTooltipRenderer = (heatmapConfig, yAxisCategories) => {
    //We have the labels, but we need the identifiers to do lookups
    const rowHeaderPerLabel = {};
    for(let i = 0 ; i < yAxisCategories.length ; i++){
        rowHeaderPerLabel[yAxisCategories[i].label]=yAxisCategories[i];
    }
    Object.freeze(rowHeaderPerLabel);

    const resultCache={};
    return function(rowIndex) {
        const rowHeader = yAxisCategories[rowIndex];
        if (rowHeader && rowHeader.label && rowHeaderPerLabel.hasOwnProperty(rowHeader.label)) {
            const bioentityIdentifier = rowHeaderPerLabel[rowHeader.label].id;
            const rowLabel = rowHeader.label;
            return (
                <GeneTooltip key={bioentityIdentifier}
                             atlasBaseURL={heatmapConfig.atlasUrl}
                             label={rowLabel}
                             id={bioentityIdentifier}
                             designElement={rowHeaderPerLabel[rowLabel].info.designElement||""}
                             {...
                                 resultCache.hasOwnProperty(bioentityIdentifier) ?
                                     {data: resultCache[bioentityIdentifier]} :
                                     {onAjaxSuccessfulCacheResult: (result)=>{resultCache[bioentityIdentifier]=result}}
                             }
                />
            );
        } else {
            return null;
        }
    }
};

//TODO consider what the interface of this function should be.
export default function(heatmapConfig, xAxisCategories, yAxisCategories) {
    return {
        row: createRowLabelTooltipRenderer(heatmapConfig, yAxisCategories),
        column: createColumnLabelTooltipRenderer(heatmapConfig, xAxisCategories),
        point: () => {}
    }
}
