'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHeatmapYAxisCategories = exports.getHeatmapXAxisCategories = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _experimentTypeUtils = require('./experimentTypeUtils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// For each column grouping get the groups that contain a specific ID, or the group Unmapped if it has no groups
var getGroupsThatContainId = function getGroupsThatContainId(columnGroupings, id) {
  return columnGroupings.map(function (grouping) {
    var values = grouping.groups.filter(function (group) {
      return group.values.includes(id);
    }).map(function (group) {
      return {
        label: group.name,
        id: group.id
      };
    });

    return {
      name: grouping.name,
      memberName: grouping.memberName,
      values: values.length ? values : [{ label: 'Unmapped', id: '' }]
    };
  });
};

var getHeatmapXAxisCategories = function getHeatmapXAxisCategories(_ref) {
  var columnHeaders = _ref.columnHeaders,
      columnGroupings = _ref.columnGroupings,
      experiment = _ref.experiment,
      inProxy = _ref.inProxy,
      atlasUrl = _ref.atlasUrl,
      pathToResources = _ref.pathToResources;

  if ((0, _experimentTypeUtils.isMultiExperiment)(experiment)) {
    return columnHeaders.map(function (columnHeader) {
      return {
        label: columnHeader.factorValue,
        id: columnHeader.factorValueOntologyTermId || '',
        info: {
          trackId: '',
          tooltip: {},
          groupings: getGroupsThatContainId(columnGroupings, columnHeader.factorValueOntologyTermId || '')
        }
      };
    });
  } else if ((0, _experimentTypeUtils.isDifferential)(experiment)) {
    return columnHeaders.map(function (columnHeader) {
      return {
        label: columnHeader.displayName,
        id: columnHeader.id,
        info: {
          trackId: columnHeader.id,
          tooltip: _extends({
            resources: columnHeader.resources.map(function (resource) {
              return {
                type: resource.type,
                url: _url2.default.resolve(inProxy + atlasUrl, resource.uri),
                icon: _url2.default.resolve(pathToResources, _path2.default.basename(require('../../assets/' + resource.type + '-icon.png')))
              };
            })
          }, columnHeader.contrastSummary),
          groupings: []
        }
      };
    });
  } else {
    return columnHeaders.map(function (columnHeader) {
      return {
        label: columnHeader.factorValue,
        id: columnHeader.factorValueOntologyTermId || '',
        info: {
          trackId: columnHeader.assayGroupId,
          tooltip: {
            properties: columnHeader.assayGroupSummary.properties,
            replicates: columnHeader.assayGroupSummary.replicates
          },
          groupings: getGroupsThatContainId(columnGroupings, columnHeader.factorValueOntologyTermId || '')
        }
      };
    });
  }
};

var getHeatmapYAxisCategories = function getHeatmapYAxisCategories(_ref2) {
  var rows = _ref2.rows,
      geneQuery = _ref2.geneQuery,
      experiment = _ref2.experiment,
      inProxy = _ref2.inProxy,
      atlasUrl = _ref2.atlasUrl;
  return rows.map(function (profile) {
    return {
      label: profile.name,
      id: profile.id,
      info: {
        trackId: profile.id,
        designElement: profile.designElement || '',
        url: _url2.default.resolve(inProxy + atlasUrl, profile.uri)
      }
    };
  });
};

exports.getHeatmapXAxisCategories = getHeatmapXAxisCategories;
exports.getHeatmapYAxisCategories = getHeatmapYAxisCategories;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(getGroupsThatContainId, 'getGroupsThatContainId', 'src/load/heatmapAxisCategories.js');

  __REACT_HOT_LOADER__.register(getHeatmapXAxisCategories, 'getHeatmapXAxisCategories', 'src/load/heatmapAxisCategories.js');

  __REACT_HOT_LOADER__.register(getHeatmapYAxisCategories, 'getHeatmapYAxisCategories', 'src/load/heatmapAxisCategories.js');
}();

;