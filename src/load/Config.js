// const genomeBrowserTemplate = require('./genomeBrowserTemplate.js');

const capitalizeFirstLetter = str => !str ? str : str.charAt(0).toUpperCase() + str.substr(1);

const _introductoryMessage = (isMultiExperiment, profiles) => {
    const shownRows = profiles.rows.length;
    const totalRows = profiles.searchResultTotal;

    const what =
        (isMultiExperiment ? `experiment` : `gene`) +
        (totalRows > 1 ? `` : ``);

    return `Showing ${shownRows} ` + (totalRows === shownRows ? what + `:` : `of ${totalRows} ${what} found:`);
};

const geneURL = config =>
    `/query?geneQuery=${config.geneQuery}&conditionQuery=${config.conditionQuery}&organism=${config.species}`;

const _coexpressions = jsonCoexpressions =>
    /*
     The backend code and the feature in the old heatmap were written to support coexpressions of multiple genes.
     It doesn't seem necessary, so this assumes zero or one coexpressions.
     */
    ( jsonCoexpressions[0] ?
            {
                coexpressedGene: jsonCoexpressions[0].geneName,
                numCoexpressionsAvailable:
                    jsonCoexpressions[0].jsonProfiles ? jsonCoexpressions[0].jsonProfiles.rows.length : 0
            } :
            ``
    );

const coexpressions = (setupConfig, data) =>
    (
        setupConfig.isExperimentPage && data.jsonCoexpressions && Array.isArray(data.jsonCoexpressions) ?
            _coexpressions(data.jsonCoexpressions) : ``
    );


const getConfig = (setupConfig, data) => {
    const config = {
        geneQuery: data.config.geneQuery,
        atlasBaseURL: setupConfig.atlasBaseURL,
        pathToFolderWithBundledResources: setupConfig.pathToFolderWithBundledResources,
        isExperimentPage: setupConfig.isExperimentPage,
        isMultiExperiment: setupConfig.isMultiExperiment,
        isReferenceExperiment: setupConfig.isReferenceExperiment,
        isDifferential: setupConfig.isDifferential,
        introductoryMessage: _introductoryMessage(setupConfig.isMultiExperiment,data.profiles),
        description: setupConfig.isExperimentPage && data.experiment && data.experiment.description ? data.experiment.description : ``,
        xAxisLegendName: capitalizeFirstLetter(data.config.columnType) || `Experimental condition`,
        yAxisLegendName: setupConfig.isExperimentPage ? `Gene name`: `Experiment`,
        coexpressions : coexpressions(setupConfig, data)
    };


    let description = ``;
    if (data.jsonExperiment) {
        if (data.jsonExperiment.description && setupConfig.isExperimentPage) {
            description = data.jsonExperiment.description;
        } else if (setupConfig.isReferenceExperiment && data.jsonExperiment.URL) {
            description = `Reference experiment: ${setupConfig.atlasBaseURL}${data.jsonExperiment.URL}`;
        }
    } else if (config.description) {
        description = config.description;
    } else if (setupConfig.isMultiExperiment) {
        description = `Query results for: ${decodeURIComponent(config.geneQuery)}`;
        if (config.conditionQuery && decodeURIComponent(config.conditionQuery).length > 2) {
            description = `${description}, in conditions: ${decodeURIComponent(config.conditionQuery)}`;
        }
        description = `${description}, in species: ${config.species}`
    }

    let shortDescription = ``;
    if (config.experimentAccession) {
        if (setupConfig.isReferenceExperiment) {
            shortDescription = `ReferenceExp`;
        }
        shortDescription = `${shortDescription}${config.experimentAccession}`;
    } else {
        shortDescription = `expression-atlas-${data.config.species.replace(/ +/, `-`)}`;
    }

    Object.assign(config,
        data.config,
        { geneURL: geneURL(config)},
        { genomeBrowserTemplate: setupConfig.isExperimentPage ? `` : `` },
        { description: description },
        { shortDescription: shortDescription});

    return Object.freeze(config);
};

module.exports = getConfig;
