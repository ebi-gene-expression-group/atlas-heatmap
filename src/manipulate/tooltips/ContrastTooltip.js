import React from 'react'
import PropTypes from 'prop-types'

const PropertyRow = (props) => {
  if (!props.testValue && !props.referenceValue) {
    return null
  }

  const style = {whiteSpace: `normal`}

  if (props.contrastPropertyType === `FACTOR`) {
    style.fontWeight = `bold`
  } else {
    style.color = `gray`
  }

  return (
    <tr key={`${props.contrastPropertyType}-${props.propertyName}`}>
      <td style={style}>{props.propertyName}</td>
      <td style={style}>{props.testValue}</td>
      <td style={style}>{props.referenceValue}</td>
    </tr>
  )
}

const ContrastTooltipTable = (props) =>
  <div>
      <div id="contrastExperimentDescription" style={{fontWeight: `bold`, color: `blue`, textAlign: `center`}}>
        {props.experimentDescription}
      </div>
      <div id="contrastDescription" style={{textAlign: `center`}}>{props.contrastDescription}</div>
      <table style={{padding: `0`, margin: `0`, width: `100%`}}>
          <thead>
              <tr>
                  <th>Property</th>
                  <th>Test value (N={props.testReplicates})</th>
                  <th>Reference value (N={props.referenceReplicates})</th>
              </tr>
          </thead>
          <tbody>
              {props.properties.map((property) => <PropertyRow {...property}/>)}
          </tbody>
      </table>
  </div>


ContrastTooltipTable.propTypes = {
  experimentDescription: PropTypes.string.isRequired,
  contrastDescription: PropTypes.string.isRequired,
  testReplicates: PropTypes.number.isRequired,
  referenceReplicates: PropTypes.number.isRequired,
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      contrastPropertyType: PropTypes.string,
      propertyName: PropTypes.string.isRequired,
      referenceValue: PropTypes.string.isRequired,
      testValue: PropTypes.string.isRequired
    })
  )
}

const ContrastTooltip = (props) => {
  const descriptions = {
    "gsea_go": `Click to view GO terms enrichment analysis plot`,
    "gsea_interpro": `Click to view Interpro domains enrichment analysis plot`,
    "gsea_reactome": `Click to view Reactome pathways enrichment analysis plot`,
    "ma-plot": `Click to view MA plot for the contrast across all genes`
  }

  return (
    <div className="gxaContrastTooltip">
      <ContrastTooltipTable {...props} />
      <div className="contrastPlots">
        <span>
          {this.props.resources.length && <span> Available plots: </span>}
          {this.props.resources.map((resource) =>
            <a href={resource.url} key={resource.type} title={descriptions[resource.type]}
               style={{textDecoration: `none`}} target={`_blank`}>
              <img src={resource.icon} />
            </a>
          )}
        </span>
        <div className="info"> Click label to interact with tooltip</div>
      </div>
    </div>
  )
}

ContrastTooltip.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf([`gsea_go`, `gsea_interpro`, `gsea_reactome`, `ma-plot`]).isRequired,
    url: PropTypes.string.isRequired
  })).isRequired,
  ...ContrastTooltipTable.propTypes
}

export default ContrastTooltip
