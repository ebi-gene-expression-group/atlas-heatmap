'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _experimentTypeUtils = require('./experimentTypeUtils.js');

var _utils = require('../utils');

// Message on top of the chart: “Showing 3 experiments:”, “Showing 12 genes of 432 found:”, “Showing 32 genes:”...
var introductoryMessage = function introductoryMessage(experiment, profiles) {
    var shownRows = profiles.rows.length;
    var totalRows = profiles.searchResultTotal;

    var what = (experiment ? 'gene' : 'experiment') + (totalRows > 1 ? 's' : '');

    return 'Showing ' + (0, _utils.numberWithCommas)(shownRows) + ' ' + (totalRows === shownRows ? what + ':' : 'of ' + (0, _utils.numberWithCommas)(totalRows) + ' ' + what + ' found:');
};

var queryDescription = function queryDescription(geneQuery, conditionQuery, species) {
    // Since Atlas uses URLEncoder in SemanticQuery.java
    var plusDecode = function plusDecode(str) {
        return decodeURIComponent(str.replace(/\+/g, '%20'));
    };

    var decodedGeneQuery = plusDecode(geneQuery);
    var decodedConditionQuery = plusDecode(conditionQuery);
    var decodedSpecies = plusDecode(species);

    return 'Query results for: ' + decodedGeneQuery + (decodedConditionQuery ? ', in conditions ' + decodedConditionQuery : '') + (decodedSpecies ? ', in species ' + (decodedSpecies[0].toUpperCase() + decodedSpecies.slice(1).toLowerCase()) : '');
};

var getChartConfiguration = function getChartConfiguration(data, inProxy, outProxy, atlasUrl, isWidget) {
    var experiment = data.experiment,
        profiles = data.profiles;
    var _data$config = data.config,
        geneQuery = _data$config.geneQuery,
        conditionQuery = _data$config.conditionQuery,
        species = _data$config.species,
        disclaimer = _data$config.disclaimer,
        columnType = _data$config.columnType,
        resources = _data$config.resources;


    var chartTextDecorations = {
        introductoryMessage: introductoryMessage(experiment, profiles),
        xAxisLegendName: (0, _utils.capitalizeFirstLetter)(columnType) || 'Experimental condition',
        yAxisLegendName: (0, _experimentTypeUtils.isMultiExperiment)(experiment) ? 'Experiment' : 'Gene name'
    };

    var description = (0, _experimentTypeUtils.isMultiExperiment)(experiment) ? queryDescription(geneQuery, conditionQuery, species) :
    // description can be empty, see ExperimentsCacheLoader.java or BaselineExperimentsBuilder.java
    experiment.description || experiment.accession;

    var shortDescription = (0, _experimentTypeUtils.isMultiExperiment)(experiment) ? 'expression_atlas-' + species.replace(/ +/, '_') : experiment.accession;

    return Object.freeze(_extends({
        inProxy: inProxy,
        outProxy: outProxy,
        atlasUrl: atlasUrl,
        experiment: experiment,
        isWidget: isWidget,
        description: description,
        shortDescription: shortDescription,
        disclaimer: disclaimer
    }, chartTextDecorations, {
        genomeBrowsers: data.config.genomeBrowsers,
        coexpressionsAvailable: Boolean(data.coexpressions),
        isMultiExperiment: (0, _experimentTypeUtils.isMultiExperiment)(experiment),
        isBaseline: (0, _experimentTypeUtils.isBaseline)(experiment),
        isDifferential: (0, _experimentTypeUtils.isDifferential)(experiment)
    }));
};

var _default = getChartConfiguration;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(introductoryMessage, 'introductoryMessage', 'src/load/chartConfiguration.js');

    __REACT_HOT_LOADER__.register(queryDescription, 'queryDescription', 'src/load/chartConfiguration.js');

    __REACT_HOT_LOADER__.register(getChartConfiguration, 'getChartConfiguration', 'src/load/chartConfiguration.js');

    __REACT_HOT_LOADER__.register(_default, 'default', 'src/load/chartConfiguration.js');
}();

;