"use strict";

//*------------------------------------------------------------------*

/*
All functions in this module accept and return a following format of data:
{
  dataSeries : [info: {...: String}, data: [Point]}]
  xAxisCategories: [X axis label]
  yAxisCategories: [Y axis label]
}
*/

//*------------------------------------------------------------------*

var orderHeatmapData = function(ordering, data){
  var permuteX = function(x){
    return ordering.columns.indexOf(x);
  };

  var permuteY = function(y){
    return ordering.rows.indexOf(y);
  };

  var permutePoint = function(point){
    return {
      x: permuteX(point.x),
      y: permuteY(point.y),
      value: point.value,
      info: point.info
    };
  };

  var permuteArray = function(arr, permute){
    return (
      arr
        .map(
          function(el, ix){
          return [el, permute(ix)];
          })
        .sort(
          function(l,r){
          return l[1]-r[1];
          })
        .map(
          function(el){
          return el[0];
          }
      )
    );
  };

  return {
    dataSeries: data.dataSeries.map(
        function(series){
          return {
            info: series.info,
            data: series.data.map(permutePoint)
          };
        }),
    xAxisCategories: permuteArray(data.xAxisCategories, permuteX),
    yAxisCategories: permuteArray(data.yAxisCategories, permuteY)
  };
};

var _axisElementsForFilteredDataSeries = function(axis, conditionPerSeries, conditionPerPoint, dataSeries){
  return (
    dataSeries
    .filter(conditionPerSeries)
    .map((e)=>
      e.data)
    .reduce((l,r)=>
      l.concat(r),[])
    .filter(conditionPerPoint)
    .map((e)=>
      e[axis])
    .filter((e,ix,self)=>
      self.indexOf(e) ===ix)
    .sort((l,r) =>
      l-r)
  );
};

const _filterHeatmapData = (keepSeries, keepPoint, data) => {
    const allXs = _axisElementsForFilteredDataSeries(`x`, keepSeries, keepPoint, data.dataSeries);
    const allYs = _axisElementsForFilteredDataSeries(`y`, keepSeries, keepPoint, data.dataSeries);

    const newDataSeries =
        data.dataSeries
        .map((series, ix) =>
            keepSeries(series,ix) ? series.data.filter(keepPoint) : []
        )
        .map(series =>
            series
            .map(point =>
                ({
                    x: allXs.indexOf(point.x),
                    y: allYs.indexOf(point.y),
                    value: point.value,
                    info: point.info
                })
            )
            .filter(point => point.x > -1 && point.y > -1)
        );

    return {
        dataSeries: data.dataSeries.map((e, ix) =>
            ({
                info: e.info,
                data: newDataSeries[ix]
            })
        ),
        xAxisCategories: data.xAxisCategories.filter((e, ix) => allXs.indexOf(ix)>-1),
        yAxisCategories: data.yAxisCategories.filter((e, ix) => allYs.indexOf(ix)>-1)
    }
};

const filterHeatmapData = (keepSeries, keepRow, keepColumn, data) => {
  return _filterHeatmapData(
    keepSeries,
    (point) => (keepRow(data.yAxisCategories[point.y]) && keepColumn(data.xAxisCategories[point.x])),
    data
  )
}

var _calculateInserts = function(fullColumns,originalColumns){
  var result = [];
  var fullColumnsCursor=0;
  var originalColumnsCursor=0;
  while(fullColumnsCursor<fullColumns.length && originalColumnsCursor < originalColumns.length){
    if(fullColumns.length > fullColumnsCursor
      && originalColumns.length > originalColumnsCursor
      && fullColumns[fullColumnsCursor] == originalColumns[originalColumnsCursor]){
      result.push("");
      fullColumnsCursor++;
      originalColumnsCursor++;
    } else if(fullColumns.length > fullColumnsCursor){
      result.push(fullColumns[fullColumnsCursor]);
      fullColumnsCursor++;
    } else if(originalColumns[originalColumnsCursor].length > originalColumnsCursor){
      result.push("");
      originalColumnsCursor++;
    }
  }
  return result;
};

var _indicesForInserts = function(inserts){
  var i=-1;
  return (
    inserts
    .map(function(e){
      !e && i++;
      return i;
    })
  )
};

var insertEmptyColumns = function(newColumns,data){
  var fullColumns =
    newColumns.concat(
     data.xAxisCategories
     .filter(function(originalColumn){
       return (
         newColumns
         .findIndex((e)=>e.label==originalColumn.label)
         ==-1
       )
     })
    );
  var insertIndices =
    _indicesForInserts(
      _calculateInserts(
        fullColumns
        .map((e)=>e.label),
        data.xAxisCategories
        .map((e)=>e.label)
      )
    );
  return {
    dataSeries: data.dataSeries.map(function(e){
      return {
        info: e.info,
        data:
          e.data
          .map(function(point){
            return Object.assign(
              {},
              point,
              {x:
                insertIndices.indexOf(point.x)
              }
            )
          })
      }
    }),
    xAxisCategories: fullColumns,
    yAxisCategories: data.yAxisCategories
  };
};

exports.insertEmptyColumns = insertEmptyColumns;
exports.filterHeatmapData = filterHeatmapData;
exports.order = orderHeatmapData;

exports.manipulate = function(args, data){
  return (
    insertEmptyColumns(
      args.allowEmptyColumns
      ? orderHeatmapData(args.ordering, data).xAxisCategories
      :[],
      filterHeatmapData(args.keepSeries, args.keepRow, args.keepColumn,
        orderHeatmapData(args.ordering, data)
      )
    )
  );
};
