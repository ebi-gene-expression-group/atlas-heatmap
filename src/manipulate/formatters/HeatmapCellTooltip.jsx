import React from 'react';

import NumberFormat from 'expression-atlas-number-format';
const scientificNotation = value => NumberFormat.scientificNotation(value,4, {fontWeight: `bold`});

const roundTStat = (n) => (
  n ? +n.toFixed(4) : ""
)

const _tinySquare= (colour) => {
    return (
        <span key={`Tiny ${colour} square`}
              style={{
                  border: `1px rgb(192, 192, 192) solid`,
                  marginRight: `2px`,
                  width: `6px`,
                  height: `6px`,
                  display: `inline-block`,
                  backgroundColor: colour
              }}
        />
    );
}

const _info = (text) => {
    return (
        <div>
            <i>{text}</i>
        </div>
    );
}

const _div = (name, value, format) => {
    return (
        name && value ?
            <div key={`${name} ${value}`}>
                {`${name}: `}
                {value.length > 50 ? <br/> : null }
                {(format || _bold)(value)}
            </div> :
            null
    );
}

const _span = (name, value) =>  {
    return (
        <span key={`${name} ${value}`}>
            {`${name}: `}
            {value.length > 50 ? <br/> : null }
            {_bold(value)}
        </span>
    );
}

const _bold = (value) =>  {
    return <b>{value}</b>;
}

const HeatmapCellTooltip =
  ({config, colour, xLabel, yLabel,
    value, unit, foldChange, pValue,
    tStat, xAxisLegendName}) => (
  <div style={{
      whiteSpace: `pre`,background: `rgba(255, 255, 255, .85)`,
      padding: `5px`, border: `1px solid darkgray`,
       borderRadius: `3px`, boxShadow:`2px 2px 2px darkslategray`}}>
      {_div(config.yAxisLegendName, yLabel)}
      {_div(xAxisLegendName || config.xAxisLegendName, xLabel)}
      {config.isDifferential
        ?
          [<div key={``}>{_tinySquare(colour)}{_span(`Fold change`, foldChange)}</div>,
              _div(`P-value`, pValue, scientificNotation),
              _div(`T-statistic`, roundTStat(tStat))]
        :
          <div>
              {[
                  _tinySquare(colour),
                  _span(`Expression level`, value ?
                      `${value} ${unit}` : `Below cutoff`)
              ]}
          </div>
      }
      { !! config.genomeBrowserTemplate &&
          _info(`Click on the cell to show expression in the Genome Browser`) }
  </div>
)

HeatmapCellTooltip.propTypes = {
    //TODO extend this prop checker.Props for this component are created dynamically so it's important. If differential, expect p-values and fold changes, etc.
    config: React.PropTypes.shape({
        isDifferential: React.PropTypes.bool.isRequired,
        xAxisLegendName: React.PropTypes.string.isRequired,
        yAxisLegendName: React.PropTypes.string.isRequired,
        genomeBrowserTemplate:React.PropTypes.string.isRequired
    }).isRequired,
    colour: React.PropTypes.string.isRequired,
    xLabel: React.PropTypes.string.isRequired,
    yLabel: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired,
    unit: React.PropTypes.string.isRequired,
    foldChange: React.PropTypes.number,
    pValue: React.PropTypes.number,
    tStat: React.PropTypes.number,
    xAxisLegendName: React.PropTypes.string
};

export default HeatmapCellTooltip;
