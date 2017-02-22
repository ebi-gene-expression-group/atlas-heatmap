import React from 'react';
import URI from 'urijs';

const ExperimentDescription = function(props) {
    return  (
        <div style={{width: `100%`, paddingBottom: `20px`}}>
            <div>
                <a target="_blank" href={props.experimentUrl.toString()}>{props.description}</a>
            </div>
            <div>
                Organism: <i>{props.species}</i>
            </div>
        </div>
    );
};

ExperimentDescription.propTypes = {
    experimentUrl: React.PropTypes.instanceOf(URI).isRequired,
    description: React.PropTypes.string.isRequired,
    species: React.PropTypes.string.isRequired
};

export default ExperimentDescription;
