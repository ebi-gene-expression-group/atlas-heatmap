import Url from 'url';
import Path from 'path';

import {isMultiExperiment, isDifferential} from './experimentTypeUtils.js';

// For each column grouping get the groups that contain a specific ID, or the group Unmapped if it has no groups
const getGroupsThatContainId = (columnGroupings, id) =>
    columnGroupings.map(grouping => {
        const values =
            grouping.groups
                .filter(group => group.values.includes(id))
                .map(group => ({
                    label: group.name,
                    id: group.id
                }));

        return {
            name: grouping.name,
            memberName: grouping.memberName,
            values: values.length ? values : [{label: `Unmapped`, id: ``}]
        }
    });

const getHeatmapXAxisCategories = (columnHeaders, columnGroupings, experiment, inProxy, atlasUrl, pathToResources) =>
    columnHeaders.map(
        isMultiExperiment(experiment) ?
            columnHeader => ({
                label: columnHeader.factorValue,
                id : columnHeader.factorValueOntologyTermId || ``,
                info: {
                    trackId: ``,
                    tooltip: {},
                    groupings: getGroupsThatContainId(columnGroupings, columnHeader.factorValueOntologyTermId || ``)
                }}) :

            isDifferential(experiment) ?
                columnHeader => ({
                    label: columnHeader.displayName,
                    id: columnHeader.id,
                    info:{
                        trackId:columnHeader.id,
                        tooltip: {
                            resources:
                                columnHeader.resources.map(resource => ({
                                    type: resource.type,
                                    uri: inProxy + atlasUrl + resource.uri,
                                    icon: inProxy + atlasUrl +
                                    Url.resolve(
                                        pathToResources,
                                        Path.basename(require(`../../assets/${resource.type}-icon.png`)))
                                })),
                            ...columnHeader.contrastSummary
                        },
                        groupings:[]
                    }}) :
                columnHeader => ({
                    label: columnHeader.factorValue,
                    id : columnHeader.factorValueOntologyTermId || ``,
                    info: {
                        trackId: columnHeader.assayGroupId,
                        tooltip: columnHeader.assayGroupSummary,
                        groupings: getGroupsThatContainId(columnGroupings, columnHeader.factorValueOntologyTermId || ``)
                    }
                })
    );

const getHeatmapYAxisCategories = (rows, geneQuery, experiment) =>
    rows.map(
        isMultiExperiment(experiment) ?
            profile => ({
                label: profile.name,
                id : profile.uri || (profile.id + `?geneQuery=${geneQuery}`) +
                (profile.serializedFilterFactors ?
                    `&serializedFilterFactors=${encodeURIComponent(profile.serializedFilterFactors)}` : ``),
                info: {
                    trackId: ``,
                    designElement: ``
                }
            }) :
            profile => ({
                label: profile.name,
                id: profile.uri || profile.id,
                info: {
                    trackId: profile.id,
                    designElement: profile.designElement || ``
                }
            })
    );

export {getHeatmapXAxisCategories, getHeatmapYAxisCategories};
