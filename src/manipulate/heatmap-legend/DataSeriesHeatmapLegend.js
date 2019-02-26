import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const LegendItem = styled.div`
  display: inline-block;
  margin-left: 8px;
  padding: 4px;
  vertical-align: middle;
  cursor: default;
  ${props => !props.on && `
    color: #ccc;
  `}
`

const LegendRectangle = styled.div `
  width: 12px;
  height: 12px;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  display: inline-block;
  margin-right: 4px;
  vertical-align: middle;
  background: ${(props) => props.background};
`

const VerticallyAlignedSpan = styled.span`
  vertical-align: middle;
`

const DataSeriesHeatmapLegendBox = (props) =>
  <LegendItem on={props.on}>
    <LegendRectangle background={props.colour} on={props.on} />
    <VerticallyAlignedSpan>{props.name}</VerticallyAlignedSpan>
  </LegendItem>

DataSeriesHeatmapLegendBox.propTypes = {
  name: PropTypes.string.isRequired,
  colour: PropTypes.string.isRequired,
  on: PropTypes.bool.isRequired
}


const HeatmapLegendContainer = styled.div`
  color: #606060;
  border: 0 solid olive;
  text-align: right;
`

const InfoIcon = styled.span`
  ::before {
    font-family: 'EBI-Generic', 'sans-serif';
    font-size: 150%;
    color: #7e7e7e;
    content: attr(data-icon);
    margin: 0 0 0 0;
  }
`

const ExperimentIconDiv = styled.span`
  background-color: ${props => props.background};
  color: ${props => props.color};
  border-radius: 50%;
  height: 20px;
  width: 20px;
  padding: 1px 5px 1px 5px;
  margin-right: 6px;
  margin-left: 10px;
  display: inline-block;
`

const DataSeriesHeatmapLegend = (props) =>
  <HeatmapLegendContainer>
    <ExperimentIconDiv background={`green`} color={`white`}>P</ExperimentIconDiv>Proteomics
    <ExperimentIconDiv background={`#148ff3`} color={`white`}>T</ExperimentIconDiv>Transcriptomics
    <br/>
    <LegendItem>
      <InfoIcon
          data-icon="i" data-toggle="tooltip" data-placement="bottom"
          title={props.title}/>
    </LegendItem>
    {props.legendItems.map(legendItemProps => <DataSeriesHeatmapLegendBox {...legendItemProps} />)}
    <DataSeriesHeatmapLegendBox
      key={props.missingValueLabel}
      name={props.missingValueLabel}
      colour={props.missingValueColour}
      on={true}
    />

  </HeatmapLegendContainer>

DataSeriesHeatmapLegend.propTypes = {
  legendItems: PropTypes.arrayOf(PropTypes.shape(DataSeriesHeatmapLegendBox.propTypes)).isRequired,
  title: PropTypes.string,
  missingValueColour: PropTypes.string,
  missingValueLabel: PropTypes.string
}

DataSeriesHeatmapLegend.defaultProps = {
  title: `Baseline expression levels in RNA-seq experiments are in FPKM or TPM. ` +
    `Low: 0.5-10, Medium: 11-1,000, ` +
    `High: >1,000. ` +
    `Proteomics expression levels are mapped to low, medium, high per experiment basis.`,
  missingValueColour: `white`,
  missingValueLabel: `No data available`
}

export default DataSeriesHeatmapLegend
