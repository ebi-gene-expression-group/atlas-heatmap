import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import ExperimentDescription from './ExperimentDescription.js'
import Footer from './Footer.js'

import ChartContainer from '../manipulate/ChartContainer.js'

import DataPropTypes from './jsonPayloadPropTypes.js'
import loadChartData from '../load/main.js'

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

            <ChartContainer chartData={loadChartData(props)} />

            {isWidget &&
            <Footer outProxy={outProxy}
                    atlasUrl={atlasUrl}
                    moreInformationUrl={moreInformationUrl.toString()} />
            }
        </div>
    )
}

Container.propTypes = {
    inProxy: PropTypes.string.isRequired,
    outProxy: PropTypes.string.isRequired,
    atlasUrl: PropTypes.string.isRequired,
    sourceUrl: PropTypes.string.isRequired,
    showAnatomogram: PropTypes.bool.isRequired,
    isWidget: PropTypes.bool.isRequired,
    data: DataPropTypes.isRequired
}

export default Container
