import assert from 'assert'
import subject from '../src/load/main.js'

describe(`Experiment page baseline one gene with coexpressions`, function() {
  let data = require(`./data/experimentPageBaselineOneGeneWithCoexpressions.json`)

  let config = {
    "isExperimentPage": true,
    "isMultiExperiment": false,
    "isReferenceExperiment": false,
    "isDifferential": false,
    "atlasBaseUrl": `test-invalid`
  }
  describe(`Returned object for data with coexpressions`, function() {
    it(`coexpressions should end up with the rest of the data`, function() {
      let result = subject(config, data.actual)

      assert.ok([].concat.apply([],result.heatmapData.dataSeries.map((series)=>series.data)).length > 1*result.heatmapData.xAxisCategories.length)
    })
    it(`should be the same as the JSON dump of the result`, function(){
      let result = subject(config, data.actual)
      assert.deepEqual(data.expected,result.heatmapData)
    })

    it(`should have the indices that are not only zero`, function(){
      let result = subject(config, data.actual)
      assert.deepEqual(
        [].concat.apply([],result.heatmapData.dataSeries.map((series)=>series.data))
          .map((point)=>point.info.index)
          .filter((el,ix,self)=>self.indexOf(el)===ix)
          .length
        ,50
      )
    })
  })
})

describe(`Gene page baseline one row`, function() {
  let data = require(`./data/genesetPageOneRow.json`)

  let config = {
    "isExperimentPage": false,
    "isMultiExperiment": true,
    "isReferenceExperiment": false,
    "isDifferential": false,
    "atlasBaseUrl": `test-invalid`
  }
  describe(`Returned object`, function() {
    let result = subject(config, data.actual)

    it(`should have one row`, function() {
      assert.equal([].concat.apply([],result.heatmapData.dataSeries.map((series)=>series.data)).length,result.heatmapData.xAxisCategories.length)
    })
    it(`should be the same as the JSON dump of the result`, function(){
      let result = subject(config, data.actual)
      assert.deepEqual(data.expected,result.heatmapData)
    })
  })
})
describe(`Proteomics experiment page`, function() {
  let data = require(`./data/experimentPageProteomicsBaseline.json`)

  let config = {
    "isExperimentPage": true,
    "isMultiExperiment": false,
    "isReferenceExperiment": false,
    "isDifferential": false,
    "atlasBaseUrl": `test-invalid`
  }
  describe(`Returned object for data with coexpressions`, function() {
    it(`should have no coexpressions`, function() {
      let result = subject(config, data.actual)
      assert.equal([].concat.apply([],result.heatmapData.dataSeries.map((series)=>series.data)).length, 1*result.heatmapData.yAxisCategories.length)
    })
    it(`should be the same as the JSON dump of the result`, function(){
      let result = subject(config, data.actual)
      assert.deepEqual(data.expected,result.heatmapData)
    })

    it(`should have more than five column rows`, function(){
      let result = subject(config, data.actual)
      assert.ok(result.heatmapData.yAxisCategories.length >5)
    })
  })
})

describe(`Differential experiment page`, function() {
  let dataShort = require(`./data/experimentPageDifferentialSpecificShort.json`)
  let data = require(`./data/experimentPageDifferentialSpecific.json`)

  let config = {
    "isExperimentPage": true,
    "isMultiExperiment": false,
    "isReferenceExperiment": false,
    "isDifferential": true,
    "atlasBaseUrl": `test-invalid`
  }
  describe(`Returned object`, function() {
    let resultShort = subject(config, dataShort.actual)
    let result = subject(config, data.actual)

    it(`should be the same as the JSON dump of the result`, function(){
      assert.deepEqual(dataShort.expected,resultShort.heatmapData)
      assert.deepEqual(data.expected,result.heatmapData)
    })
    it(`should have different result sizes`, function(){
      assert.ok(resultShort.heatmapData.yAxisCategories.length <10)
      assert.ok(result.heatmapData.yAxisCategories.length >10)
    })
    it(`should have the same columns`, function(){
      assert.deepEqual(result.heatmapData.xAxisCategories.length, resultShort.heatmapData.xAxisCategories.length)
      assert.deepEqual(result.heatmapData.xAxisCategories, resultShort.heatmapData.xAxisCategories)
    })
  })
})
