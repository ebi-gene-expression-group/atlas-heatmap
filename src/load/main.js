const Config = require('./Config.js');
const Orderings = require('./Orderings.js');
const ColorAxis = require('./ColorAxis.js');
const Data = require('./Data.js');

const _allRows = function(data){
  return (
    [].concat.apply(
      data.profiles.rows,
      (data.jsonCoexpressions || [])
      .map(function(coex) {
        return (coex.jsonProfiles&&coex.jsonProfiles.rows? coex.jsonProfiles.rows:[]).map(function(row, ix) {
          return Object.assign(row, {
            coexpressionOfGene: {
              id: coex.geneId,
              name: coex.geneName,
              index: ix
            }
          })
        })
      }))
    );
};

const get = function(setupConfig, payload) {
  const config = Config(setupConfig, payload);
  const rows = _allRows(payload);
  const columnHeaders = payload.columnHeaders;

  const data = Data(config,rows,columnHeaders, payload.columnGroupings);

  return {
    heatmapConfig: config,
    colorAxis : ColorAxis(config,data.dataSeries),
    orderings: Orderings(config,rows,columnHeaders),
    heatmapData : data
  }
};

module.exports = get;
