import React from 'react';

import './DataSeriesHeatmapLegend.less';

const DataSeriesHeatmapLegendBox = props =>
    <div className={`legend-item${props.on ? `` : ` legend-item-off`}`}>
        <div style={{background: props.colour}} className="legend-rectangle"/>
        <span style={{verticalAlign: `middle`}}>{props.name}</span>
    </div>;

DataSeriesHeatmapLegendBox.propTypes = {
    name: React.PropTypes.string.isRequired,
    colour: React.PropTypes.string.isRequired,
    on: React.PropTypes.bool.isRequired
};


const DataSeriesHeatmapLegend = props =>
    <div className ="gxaHeatmapLegend">
        {props.legendItems.map(legendItemProps => <DataSeriesHeatmapLegendBox {...legendItemProps} />)}

        <div className="legend-item">
            <span className="icon icon-generic gxaInfoIcon"
                  data-icon="i" data-toggle="tooltip" data-placement="bottom"
                  title="Baseline expression levels in RNA-seq experiments are in FPKM or TPM. Low: 0.5-10,
                         Medium: 11-1,000,  High: >1,000. Proteomics expression levels are mapped to low, medium, high
                         per experiment basis.">
            </span>
        </div>

        <DataSeriesHeatmapLegendBox key={`No data available`}
                                    name={`No data available`}
                                    colour={`white`}
                                    on={true}
        />
    </div>;

DataSeriesHeatmapLegend.propTypes = {
    legendItems: React.PropTypes.arrayOf(React.PropTypes.shape(DataSeriesHeatmapLegendBox.propTypes)).isRequired
};

export default DataSeriesHeatmapLegend;


