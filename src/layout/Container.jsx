import React from 'react'
import URI from 'urijs'

import Anatomogram from 'anatomogram'

import ExperimentDescription from './ExperimentDescription.jsx';
import Footer from './Footer.jsx';

import ChartContainer from '../manipulate/ChartContainer.jsx'

import DataPropTypes from './jsonPayloadPropTypes.js'
import loadChartData from '../load/main.js'

const ChartWithAnatomogram = ({data, inProxy, outProxy, atlasUrl, showAnatomogram, isWidget}) => {
    const {experiment, columnHeaders, columnGroupings, profiles, coexpressions, config, anatomogram} = data;
    const pathToResources = inProxy + URI(`resources/js-bundles/`).absoluteTo(atlasUrl);

    const chartData = loadChartData(data, inProxy, outProxy, atlasUrl, pathToResources, isWidget);

    if (anatomogram && showAnatomogram) {
        const Wrapped = Anatomogram.wrapComponent({
            anatomogramData: anatomogram,
            pathToResources: inProxy + URI(`resources/js-bundles/`).absoluteTo(atlasUrl),
            expressedTissueColour: experiment ? `gray` : `red`,
            hoveredTissueColour: experiment ? `red` : `purple`,
            idsExpressedInExperiment: columnHeaders.map(header => header.factorValueOntologyTermId)
        }, ChartContainer, {chartData});
        return (
            <Wrapped/>
        )
    } else {
        return (
            <ChartContainer {...{chartData}}
                            ontologyIdsToHighlight={[]}
                            onOntologyIdIsUnderFocus={() => {}}
            />
        )
    }
};

ChartWithAnatomogram.propTypes = {
    inProxy: React.PropTypes.string.isRequired,
    outProxy: React.PropTypes.string.isRequired,
    atlasUrl: React.PropTypes.string.isRequired,
    sourceUrl: React.PropTypes.string.isRequired,
    showAnatomogram: React.PropTypes.bool.isRequired,
    isWidget: React.PropTypes.bool.isRequired,
    data: DataPropTypes.isRequired
};


const Container = (props) => {
    const {data, inProxy, outProxy, atlasUrl, showAnatomogram,isWidget} = props;
    const {geneQuery, conditionQuery, species} = data.config;

    const moreInformationUrl = data.experiment ?    // single experiment?
        URI(data.experiment.relUrl).absoluteTo(atlasUrl).search(``) :
        URI(atlasUrl).segment(`query`).search({geneQuery, conditionQuery, species});

    return (
        <div>
            {isWidget && data.experiment &&
            <ExperimentDescription outProxy={outProxy}
                                   experimentUrl={URI(data.experiment.relUrl).absoluteTo(atlasUrl).toString()}
                                   description={data.experiment.description} />
            }

            <ChartWithAnatomogram {...props} />

            {isWidget &&
            <Footer outProxy={outProxy}
                    atlasUrl={atlasUrl}
                    moreInformationUrl={moreInformationUrl.toString()} />
            }
        </div>
    )
};

Container.propTypes = ChartWithAnatomogram.propTypes;

export default Container
