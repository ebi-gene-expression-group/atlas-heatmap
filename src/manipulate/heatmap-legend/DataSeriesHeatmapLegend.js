import React from 'react'
import PropTypes from 'prop-types'

import './DataSeriesHeatmapLegend.css'

const DataSeriesHeatmapLegendBox = props =>
    <div className={`legend-item${props.on ? `` : ` legend-item-off`}`}>
        <div style={{background: props.colour}} className="legend-rectangle"/>
        <span style={{verticalAlign: `middle`}}>{props.name}</span>
    </div>

DataSeriesHeatmapLegendBox.propTypes = {
    name: PropTypes.string.isRequired,
    colour: PropTypes.string.isRequired,
    on: PropTypes.bool.isRequired
}


const DataSeriesHeatmapLegend = props =>
    <div className="gxaHeatmapLegend" style={{textAlign:"right"}}>
        {props.legendItems.map(legendItemProps => <DataSeriesHeatmapLegendBox {...legendItemProps} />)}

        <div className="legend-item">
            <span className="icon icon-generic gxaInfoIcon"
                  data-icon="i" data-toggle="tooltip" data-placement="bottom"
                  title={props.title}/>
        </div>

        <DataSeriesHeatmapLegendBox key={props.missingValueLabel}
                                    name={props.missingValueLabel}
                                    colour={props.missingValueColour}
                                    on={true}
        />
    </div>

DataSeriesHeatmapLegend.propTypes = {
    legendItems: PropTypes.arrayOf(PropTypes.shape(DataSeriesHeatmapLegendBox.propTypes)).isRequired,
    title: PropTypes.string,
    missingValueColour: PropTypes.string,
    missingValueLabel: PropTypes.string
}

DataSeriesHeatmapLegend.defaultProps = {
  title: "Baseline expression levels in RNA-seq experiments are in FPKM or TPM. " +
         "Low: 0.5-10, Medium: 11-1,000, " +
         "High: >1,000. " +
         "Proteomics expression levels are mapped to low, medium, high per experiment basis.",
  missingValueColour: `white`,
  missingValueLabel: `No data available`
}

export default DataSeriesHeatmapLegend
