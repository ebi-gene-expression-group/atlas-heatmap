import React from 'react'
import ReactDOM from 'react-dom'

import ExpressionAtlasHeatmap from '../src/Main.js'

class ExperimentPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      atlasUrl: null,
      experimentAccession: null,
      geneQuery: null,
      isWidget: null,
      showAnatomogram: null,
      submitAtlasUrl: `https://wwwdev.ebi.ac.uk/gxa/`,
      submitExperimentAccession: `E-GTEX-8`,
      submitGeneQuery: `[{"value":"CLPS","category":"symbol"}]`,
      submitIsWidget: true,
      submitShowAnatomogram: false
    }

    this.handleSubmit = this._handleSubmit.bind(this)
    this.handleInputChange = this._handleInputChange.bind(this)
  }

  _handleSubmit(event) {
    event.preventDefault()

    const {submitAtlasUrl, submitExperimentAccession, submitIsWidget, submitShowAnatomogram, submitGeneQuery} = this.state

    this.setState({
      atlasUrl: submitAtlasUrl,
      experimentAccession: submitExperimentAccession,
      geneQuery: submitGeneQuery,
      isWidget: submitIsWidget,
      showAnatomogram: submitShowAnatomogram
    })
  }

  _handleInputChange(event) {
    const target = event.target
    const value = target.type === `checkbox` ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div className="row column">
        <div className="row">
          <div className="small-12 columns">
            <form onSubmit={this.handleSubmit}>
              <label>Expression Atlas URL: (remember the trailing slash) <input name="submitAtlasUrl" type="url" value={this.state.submitAtlasUrl} onChange={this.handleInputChange} /></label>
              <label>Experiment accession: <input name="submitExperimentAccession" type="text" value={this.state.submitExperimentAccession} onChange={this.handleInputChange} /></label>
              <label>Gene query: <input name="submitGeneQuery" type="text" value={this.state.submitGeneQuery} onChange={this.handleInputChange} /></label>
              <label>As widget? <input name="submitIsWidget" type="checkbox" checked={this.state.submitIsWidget} onChange={this.handleInputChange} /></label>
              <label>Show anatomogram? <input name="submitShowAnatomogram" type="checkbox" checked={this.state.submitShowAnatomogram} onChange={this.handleInputChange} /></label>
              <button type="submit" className="button">Render</button>
            </form>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="small-12 columns">
            {this.state.atlasUrl && this.state.experimentAccession ?
              <ExpressionAtlasHeatmap showAnatomogram={this.state.showAnatomogram}
                isWidget={this.state.isWidget}
                query={{
                  gene: this.state.geneQuery,
                  specific: false
                }}
                disableGoogleAnalytics={true}
                atlasUrl={this.state.atlasUrl}
                inProxy={``}
                outProxy={``}
                experiment={this.state.experimentAccession}
              /> :
              null
            }
          </div>
        </div>
      </div>
    )
  }
}

const render = (target) => {
  ReactDOM.render(<ExperimentPicker />, document.getElementById(target))
}

export {render}

