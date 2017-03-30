import React from 'react';
import URI from 'urijs';
import Anatomogram from 'anatomogram';

import ChartContainer from '../manipulate/ChartContainer.jsx';

import dataPropTypes from './jsonPayloadPropTypes.js';
import loadChartData from '../load/main.js';

class Container extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.disableGoogleAnalytics) {
            window.ga = () => {}
        } else {
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            window.ga('create', 'UA-37676851-1', 'auto', 'atlas-highcharts-widget');
            window.ga('atlas-highcharts-widget.send', 'pageview');
        }
    }

    render() {
        const {inProxy, outProxy, atlasUrl, isWidget} = this.props;
        const {experiment, columnHeaders, columnGroupings, profiles, coexpressions, config} = this.props.data;

        // const heatmapProps = {
        //     loadResult: Load({
        //         isExperimentPage: this._isExperimentPage(),
        //         isMultiExperiment: this.props.isMultiExperiment,
        //         isReferenceExperiment: this._isReferenceExperiment(),
        //         isDifferential: this.props.isDifferential,
        //         atlasBaseURL: this.props.atlasBaseURL,
        //         proxyPrefix: this.props.proxyPrefix,
        //         pathToFolderWithBundledResources: this.props.pathToFolderWithBundledResources
        //     }, data)
        // };

        // const heatmapProps = {
        //     loadResult: this.props.loadResult
        // }; // Overridden: ontologyIdsToHighlight, onOntologyIdIsUnderFocus

        const anatomogramConfig = {
            anatomogramData: this.props.data.anatomogram,
            pathToResources: inProxy + URI(`resources/js-bundles/`).absoluteTo(atlasUrl),
            expressedTissueColour: experiment ? `gray` : `red`,
            hoveredTissueColour: experiment ? `red` : `purple`,
            idsExpressedInExperiment: columnHeaders.map(header => header.factorValueOntologyTermId)
        };

        const pathToResources = inProxy + URI(`resources/js-bundles/`).absoluteTo(atlasUrl);
        const chartData = loadChartData(this.props.data, inProxy, outProxy, atlasUrl, pathToResources, isWidget);

        const Wrapped = Anatomogram.wrapComponent(anatomogramConfig, ChartContainer, {chartData: chartData});
        return (
            this.props.showAnatomogram && anatomogramConfig.anatomogramData ?
                <Wrapped /> :
                <ChartContainer chartData={chartData}
                                ontologyIdsToHighlight={[]}
                                onOntologyIdIsUnderFocus={() => {}}
                />
        );
    }
}

Container.propTypes = {
    inProxy: React.PropTypes.string.isRequired,
    outProxy: React.PropTypes.string.isRequired,
    atlasUrl: React.PropTypes.string.isRequired,
    showAnatomogram: React.PropTypes.bool.isRequired,
    disableGoogleAnalytics: React.PropTypes.bool.isRequired,
    data: dataPropTypes.isRequired,
    isWidget: React.PropTypes.bool.isRequired
};

export default Container;