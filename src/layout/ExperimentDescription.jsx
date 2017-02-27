import React from 'react';

const ExperimentDescription = props =>
    <div style={{width: `100%`, paddingBottom: `20px`}}>
        <div>
            <a target="_blank" href={props.outProxy + props.experimentUrl}>{props.description}</a>
        </div>
    </div>;

ExperimentDescription.propTypes = {
    outProxy: React.PropTypes.string.isRequired,
    experimentUrl: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired
};

export default ExperimentDescription;
