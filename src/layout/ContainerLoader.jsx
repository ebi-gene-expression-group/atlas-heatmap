import React from 'react';
import { connect, PromiseState } from 'react-refetch';
import URI from 'urijs';

import ExperimentDescription from './ExperimentDescription.jsx';
import Container from './Container.jsx';
import Footer from './Footer.jsx';

class ContainerLoader extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        const {inProxy, outProxy, atlasUrl, sourceUrlFetch} = this.props;

        if (sourceUrlFetch.pending) {
            return (
                <div>
                    <img src={inProxy + URI(`resources/images/loading.gif`).absoluteTo(this.props.atlasUrl)}/>
                </div>
            );
        } else if (sourceUrlFetch.rejected) {

            const error = {
                url: sourceUrlFetch.meta.request.url,
                method: sourceUrlFetch.meta.request.method,
                message: sourceUrlFetch.reason.message
            };
            if (this.props.fail) {
                this.props.fail(error);
            }
            return <div><p>Error: {error.message}</p></div>;

        } else if (sourceUrlFetch.fulfilled) {
            const data = sourceUrlFetch.value;
            const {geneQuery, conditionQuery, species} = data.config;

            const moreInformationUrl = data.experiment ?    // single experiment?
                URI(data.experiment.relUrl).absoluteTo(atlasUrl).search(``) :
                URI(atlasUrl).segment(`query`).search({geneQuery, conditionQuery, species});

            return (
                <div>
                    {this.props.isWidget && data.experiment ?
                        <ExperimentDescription outProxy={outProxy}
                                               experimentUrl={URI(data.experiment.relUrl).absoluteTo(atlasUrl).toString()}
                                               description={data.experiment.description} /> :
                        null}

                    <Container inProxy={this.props.inProxy}
                               outProxy={this.props.outProxy}
                               atlasUrl={atlasUrl}
                               disableGoogleAnalytics={this.props.disableGoogleAnalytics}
                               showAnatomogram={this.props.showAnatomogram}
                               isWidget={this.props.isWidget}
                               data={data} />

                    {this.props.isWidget ?
                        <Footer outProxy={outProxy}
                                atlasUrl={atlasUrl}
                                moreInformationUrl={moreInformationUrl.toString()} /> :
                        null}
                </div>
            );
        }
    }
}

ContainerLoader.props = {
    inProxy: React.PropTypes.string.isRequired,
    outProxy: React.PropTypes.string.isRequired,
    atlasUrl: React.PropTypes.string.isRequired,
    sourceUrl: React.PropTypes.string.isRequired,
    showAnatomogram: React.PropTypes.bool.isRequired,
    isWidget: React.PropTypes.bool.isRequired,
    disableGoogleAnalytics: React.PropTypes.bool.isRequired,
    fail: React.PropTypes.func
};

export default connect(props => ({
    sourceUrlFetch: props.inProxy + URI(props.sourceUrl).absoluteTo(props.atlasUrl),
}))(ContainerLoader)
