import React from 'react';

import NumberFormat from 'expression-atlas-number-format';
const scientificNotation = value => NumberFormat.scientificNotation(value, {fontWeight: `bold`});

class HeatmapCellTooltip extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{whiteSpace: `pre`}}>
                {this._div(this.props.config.yAxisLegendName, this.props.yLabel)}
                {this._div(this.props.xAxisLegendName || this.props.config.xAxisLegendName, this.props.xLabel)}
                {this.props.config.isDifferential ?
                    [<div key={``}>{this._tinySquare()}{this._span(`Fold change`, this.props.foldChange)}</div>,
                        this._div(`P-value`, this.props.pValue, scientificNotation),
                        this._div(`T-statistic`, this.props.tStat)] :
                    <div>
                        {[
                            this._tinySquare(),
                            this._span(`Expression level`, this.props.value ?
                                `${this.props.value} ${this.props.unit}` : `Below cutoff`)
                        ]}
                    </div>
                }
                {Boolean(this.props.config.genomeBrowserTemplate) ?
                    this._info(`Click on the cell to show expression in the Genome Browser`) : null}
            </div>
        );
    }

    _tinySquare() {
        return (
            <span key={`Tiny ${this.props.colour} square`}
                  style={{
                      border: `1px rgb(192, 192, 192) solid`,
                      marginRight: `2px`,
                      width: `6px`,
                      height: `6px`,
                      display: `inline-block`,
                      backgroundColor: this.props.colour
                  }}
            />
        );
    }

    _info (text) {
        return (
            <div>
                <i>{text}</i>
            </div>
        );
    }

    _div(name, value, format) {
        return (
            name && value ?
                <div key={`${name} ${value}`}>
                    {`${name}: `}
                    {value.length > 50 ? <br/> : null }
                    {(format || this._bold)(value)}
                </div> :
                null
        );
    }

    _span(name, value) {
        return (
            <span key={`${name} ${value}`}>
                {`${name}: `}
                {value.length > 50 ? <br/> : null }
                {this._bold(value)}
            </span>
        );
    }

    _bold(value) {
        return <b>{value}</b>;
    }
}

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
    tStat: React.PropTypes.string,
    xAxisLegendName: React.PropTypes.string
};

export default HeatmapCellTooltip;

