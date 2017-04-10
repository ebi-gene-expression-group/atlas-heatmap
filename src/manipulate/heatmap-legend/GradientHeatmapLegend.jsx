import React from 'react';

import {getUnits, experimentPropTypes} from '../../load/experimentTypeUtils';
import {numberWithCommas} from '../../utils.js';

import './GradientHeatmapLegend.less';

const renderGradient = (fromValue, toValue, colours, experiment, index) => {
    const spanStyle = { backgroundImage: `linear-gradient(to right, ${colours.join(`, `)})` };

    return (
        fromValue < toValue ?
            <div style={{display: `table-row`}} key={`gradient_${index}`}>
                <div className="gxaGradientLevel gxaGradientLevelMin">{numberWithCommas(fromValue)}</div>
                <div style={{display: `table-cell`, verticalAlign: `middle`}}>
                    <span className="gxaGradientColour" style={spanStyle} />
                </div>
                <div className="gxaGradientLevel gxaGradientLevelMax">{numberWithCommas(toValue)}</div>
            </div> :
            null
    );
};

const GradientHeatmapLegend = props => {
    const units = getUnits(props.experiment).toLowerCase();
    const legendHeader = units.length === 0 ?
        <span>Expression level</span> :
        units === `log2-fold change` ?
            <span>Expression level in log<sub>2</sub>-fold change</span> :
            <span>Expression level in {getUnits(props.experiment)}</span>;

    return (
        <div className="gxaGradientLegend">
            <div>
                {legendHeader}
            </div>
            {props.gradients.map(
                (gradientData, index) =>
                    renderGradient(gradientData.fromValue, gradientData.toValue, gradientData.colours,
                                   props.experiment, index))
            }
        </div>
    );
};

GradientHeatmapLegend.propTypes = {
    experiment: experimentPropTypes.isRequired,
    gradients: React.PropTypes.arrayOf(React.PropTypes.shape({
        fromValue: React.PropTypes.number,
        toValue: React.PropTypes.number,
        colours: React.PropTypes.arrayOf(React.PropTypes.string)
    })).isRequired
};

export default GradientHeatmapLegend;

