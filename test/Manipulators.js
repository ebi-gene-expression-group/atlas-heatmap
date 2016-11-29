var subject = require('../src/manipulate/Manipulators.js');
var assert = require('assert');
var assertPropTypes = require('./assert.js');


describe('Manipulators', function() {
  var data = require('./data/genesetPageOneRow').expected;
  describe('filterHeatmapData', function(){
    describe('keeping all series in', function(){
      var result = subject.filterHeatmapData(
        (series)=>true,
        (row)=>true,
        (column)=>true,
        data
      );
      it('result should have the data series format', function() {
        assertPropTypes.validateHeatmapData(result);
      });
      it('result should not actually change', function() {
        assert.deepEqual(data.xAxisCategories,result.xAxisCategories);
        assert.deepEqual(data.yAxisCategories,result.yAxisCategories);
        assert.deepEqual(data.dataSeries,result.dataSeries);
      });
    });
    describe('keeping one data series only', function(){
      const chosenIndex = 1;
      var result = subject.filterHeatmapData(
        (series)=>series.info.name == data.dataSeries[chosenIndex].info.name,
        (row)=>true,
        (column)=>true,
        data
      );
      it('result should have the data series format', function() {
        assertPropTypes.validateHeatmapData(result);
      });
      it('result should make one data series stay and others go away', function() {
        for(var i = 0 ; i < data.dataSeries.length ; i ++){
          if(i == chosenIndex){
            assert.deepEqual(data.dataSeries[i].data.map((point=>point.value)),result.dataSeries[i].data.map((point=>point.value)));
          } else {
            assert.deepEqual([], result.dataSeries[i].data);
          }
        }
      });
    });
    describe('keeping one row only', function(){
      const chosenIndex = 1;
      var result = subject.filterHeatmapData(
        (series)=>true,
        (row)=> row.label == data.yAxisCategories[chosenIndex].label,
        (column)=>true,
        data
      );
      it('result should have the data series format', function() {
        assertPropTypes.validateHeatmapData(result);
      });
      it('result should make one row stay and others go away', function() {
        assert.deepEqual([data.yAxisCategories[chosenIndex]], result.yAxisCategories);
      });
    });
    describe('keeping one column only', function(){
      const chosenIndex = 5;
      var result = subject.filterHeatmapData(
        (series)=>true,
        (row)=>true,
        (column)=> column.label == data.xAxisCategories[chosenIndex].label,
        data
      );
      it('result should have the data series format', function() {
        assertPropTypes.validateHeatmapData(result);
      });
      it('result should make one column stay and others go away', function() {
        assert.deepEqual([data.xAxisCategories[chosenIndex]], result.xAxisCategories);
      });
    });
    describe('filtering everything out', function(){
      var result = subject.filterHeatmapData(
        (series)=>false,
        (row)=>false,
        (column)=> false,
        data
      );
      it('result should have the data series format', function() {
        assertPropTypes.validateHeatmapData(result);
      });
      it('result should have the same amount of data series', function() {
        assert.deepEqual(data.dataSeries.length, result.dataSeries.length);
      });
      it('result should have all data series empty', function() {
        for(var i = 0 ; i< result.dataSeries.length; i ++){
          assert.deepEqual([], result.dataSeries[i].data)
        }
      });
      it('result should have no columns or rows', function() {
        assert.deepEqual([], result.xAxisCategories)
        assert.deepEqual([], result.yAxisCategories)
      });
    });
  })
});
