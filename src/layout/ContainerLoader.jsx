import React from 'react';
import { connect, PromiseState } from 'react-refetch';
import URI from 'urijs';
import EventEmitter from 'events';

import Load from '../load/main.js';

import ExperimentDescription from './ExperimentDescription.jsx';
import Footer from './Footer.jsx';
import '../HighchartsHeatmapContainer.css';

class ContainerLoader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            googleAnalyticsCallback: function () {}
        };
    }

    render () {
        const { sourceUrlFetch } = this.props;

        if (sourceUrlFetch.pending) {
            return <div><img src={URI(`resources/images/loading.gif`).absoluteTo(this.props.inboundLinksUrl)}/></div>;
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

            const moreInformationUrl = this.props.sourceUrl.segment().slice(-1)[0] === `baseline_refexperiment` ?
                URI(data.jsonExperiment.relUrl).absoluteTo(this.props.outboundLinksUrl) :
                this.props.outboundLinksUrl.clone().segment(`query`).search({geneQuery, conditionQuery, species});


            return (
                <div>
                    {this.props.sourceUrl.segment().slice(-1)[0] === `baseline_refexperiment` ?
                        <ExperimentDescription experimentUrl={moreInformationUrl}
                                               description={data.jsonExperiment.description}
                                               species={data.jsonExperiment.species} /> : null}

                    <Container columnHeaders={data.columnHeaders}
                               profiles={data.profiles}
                               geneSetProfiles={{}}
                               anatomogramData={data.anatomogram}
                               experimentData={data.experiment}
                               loadResult={{} /*Load(setupConfig, data)*/}
                               googleAnalyticsCallback={this.state.googleAnalyticsCallback}
                    />

                    {this.props.isWidget ?
                        <Footer outboundLinksUrl={this.props.outboundLinksUrl}
                                moreInformationUrl={moreInformationUrl} /> : null}
                </div>
            );
        }
    }

    componentDidMount () {
        if (!this.props.disableGoogleAnalytics) {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-37676851-1', 'auto');
            ga('send', 'pageview');

            this.setState({googleAnalyticsCallback: ga});
        }
    }

    componentDidUpdate () {
        if (this.props.anatomogramDataEventEmitter) {
            if (this.state.anatomogramData && Object.keys(this.state.anatomogramData).length !== 0) {
                this.props.anatomogramDataEventEmitter.emit(`existAnatomogramData`, true);
            } else {
                this.props.anatomogramDataEventEmitter.emit(`existAnatomogramData`, false);
            }
        }
    }

}

ContainerLoader.props = {
    sourceUrl: React.PropTypes.instanceOf(URI).isRequired,
    inboundLinksUrl: React.PropTypes.instanceOf(URI).isRequired,
    outboundLinksUrl: React.PropTypes.instanceOf(URI).isRequired,
    showAnatomogram: React.PropTypes.bool.isRequired,
    isWidget: React.PropTypes.bool.isRequired,
    disableGoogleAnalytics: React.PropTypes.bool.isRequired,
    fail: React.PropTypes.func,
    anatomogramEventEmitter: React.PropTypes.instanceOf(EventEmitter).isRequired,
    anatomogramDataEventEmitter: React.PropTypes.instanceOf(EventEmitter).isRequired
};

export default connect(props => ({
    sourceUrlFetch: props.sourceUrl.toString(),
}))(ContainerLoader)
