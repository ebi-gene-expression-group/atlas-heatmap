import React from 'react';

import './GradientHeatmapLegend.less';

const renderGradient = (fromValue, fromColour, toValue, toColour) => {
    const spanStyle = {
        backgroundImage: `linear-gradient(to right, ${fromColour}, ${toColour})`
    };

    return (
        fromValue < toValue ?
            <div style={{display: "table-row"}}>
                <div className="gxaGradientLevel gxaGradientLevelMin">{fromValue}</div>
                <div style={{display: "table-cell"}}>
                    <span className="gxaGradientColour" style={spanStyle} />
                </div>
                <div className="gxaGradientLevel gxaGradientLevelMax">{toValue}</div>
            </div> :
            null
    );
};

const GradientHeatmapLegend = props => {
    return (
        <div>
            {renderGradient(props.minDownRegulatedValue, props.minDownRegulatedColour, props.maxDownRegulatedValue, props.maxDownRegulatedColour)}
            {renderGradient(props.minUpRegulatedValue, props.minUpRegulatedColour, props.maxUpRegulatedValue, props.maxUpRegulatedColour)}
        </div>
    );
};

GradientHeatmapLegend.propTypes = {
    minDownRegulatedValue: React.PropTypes.number,
    minDownRegulatedColour: React.PropTypes.string,
    maxDownRegulatedValue: React.PropTypes.number,
    maxDownRegulatedColour: React.PropTypes.string,
    minUpRegulatedValue: React.PropTypes.number,
    minUpRegulatedColour: React.PropTypes.string,
    maxUpRegulatedValue: React.PropTypes.number,
    maxUpRegulatedColour: React.PropTypes.string
};

export default GradientHeatmapLegend;

