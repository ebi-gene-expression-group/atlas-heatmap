import React from 'react'
import URI from 'urijs'

import Anatomogram from 'anatomogram'

import ExperimentDescription from './ExperimentDescription.js'
import Footer from './Footer.js'

import ChartContainer from '../manipulate/ChartContainer.js'

import DataPropTypes from './jsonPayloadPropTypes.js'
import loadChartData from '../load/main.js'

const ChartWithAnatomogram = ({data, inProxy, outProxy, atlasUrl, showAnatomogram, isWidget}) => {
    const {experiment, columnHeaders, anatomogram} = data
    const pathToResources = inProxy + URI(`resources/js-bundles/`, atlasUrl).toString()

    const chartData = loadChartData(data, inProxy, outProxy, atlasUrl, pathToResources, isWidget)

    if (anatomogram && showAnatomogram) {
        const Wrapped = Anatomogram.wrapComponent({
            anatomogramData: anatomogram,
            pathToResources: inProxy + URI(`resources/js-bundles/`, atlasUrl).toString(),
            expressedTissueColour: experiment ? `gray` : `red`,
            hoveredTissueColour: experiment ? `red` : `purple`,
            idsExpressedInExperiment: columnHeaders.map(header => header.factorValueOntologyTermId)
        }, ChartContainer, {chartData})
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
}

ChartWithAnatomogram.propTypes = {
    inProxy: PropTypes.string.isRequired,
    outProxy: PropTypes.string.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    sourceUrl: PropTypes.string.isRequired,
    showAnatomogram: PropTypes.bool.isRequired,
    isWidget: PropTypes.bool.isRequired,
    data: DataPropTypes.isRequired
}


const Container = (props) => {
    const {data, inProxy, outProxy, atlasUrl, showAnatomogram,isWidget} = props
    const {geneQuery, conditionQuery, species} = data.config

    const moreInformationUrl = data.experiment ?    // single experiment?
        URI(data.experiment.relUrl, atlasUrl).search(``) :
        URI(atlasUrl).segment(`query`).search({geneQuery, conditionQuery, species})

    return (
        <div>
            {isWidget && data.experiment &&
            <ExperimentDescription outProxy={outProxy}
                                   experimentUrl={URI(data.experiment.relUrl, atlasUrl).toString()}
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
}

Container.propTypes = ChartWithAnatomogram.propTypes

export default Container
