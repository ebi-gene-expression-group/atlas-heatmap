import React from 'react';

import './HeatmapLegend.less';

const HeatmapLegendBox = props =>
    <div className={`legend-item${props.on ? `` : ` legend-item-off`}`}>
        <div style={{background: props.colour}} className="legend-rectangle"/>
        <span style={{verticalAlign: `middle`}}>{props.name}</span>
    </div>;

const HeatmapLegendBoxPropTypes = {
    name: React.PropTypes.string.isRequired,
    colour: React.PropTypes.string.isRequired,
    on: React.PropTypes.bool.isRequired
};

HeatmapLegendBox.propTypes = HeatmapLegendBoxPropTypes;


const HeatmapLegend = props =>
    <div className ="gxaHeatmapLegend">
        {props.legendItems.map(legendItemProps => <HeatmapLegendBox {...legendItemProps} />)}

        <div className="legend-item">
            <span className="icon icon-generic" data-icon="i" data-toggle="tooltip" data-placement="bottom"
                  title="Baseline expression levels in RNA-seq experiments are in FPKM or TPM. Low: 0.5-10,
                         Medium: 11-1,000,  High: >1,000. Proteomics expression levels are mapped to low, medium, high
                         per experiment basis.">
            </span>
        </div>

        <HeatmapLegendBox key={`No data available`}
                          name={`No data available`}
                          colour={`white`}
                          on={true}
        />
    </div>;

HeatmapLegend.propTypes = {
    legendItems: React.PropTypes.arrayOf(React.PropTypes.shape(HeatmapLegendBoxPropTypes)).isRequired
};

export default HeatmapLegend;


