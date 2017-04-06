import React from 'react';
import ReactDOM from 'react-dom';
import {ExpressionAtlasHeatmap} from '../src/Main.jsx';

class ExperimentPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            atlasUrl: `http://www-test.ebi.ac.uk/gxa/`,
            experimentAccession: `E-MTAB-513`,
            isWidget: true,
            showAnatomogram: false
        };

        this.handleInputChange = this._handleInputChange.bind(this);
    }

    _handleInputChange(event) {
        const target = event.target;
        const value = target.type === `checkbox` ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="row">
                <div className="row">
                    <div className="small-12 columns">
                        <form>
                            <label>Expression Atlas URL: (remember the trailing slash!) <input name="atlasUrl" type="url" value={this.state.atlasUrl} onChange={this.handleInputChange} /></label>
                            <label>Experiment accession: <input name="experimentAccession" type="text" value={this.state.experimentAccession} onChange={this.handleInputChange} /></label>
                            <label>As widget? <input name="isWidget" type="checkbox" checked={this.state.isWidget} onChange={this.handleInputChange} /></label>
                            <label>Show anatomogram? <input name="showAnatomogram" type="checkbox" checked={this.state.showAnatomogram} onChange={this.handleInputChange} /></label>
                        </form>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="small-12 columns">
                        <ExpressionAtlasHeatmap showAnatomogram={this.state.showAnatomogram}
                                                isWidget={this.state.isWidget}
                                                disableGoogleAnalytics={true}
                                                atlasUrl={this.state.atlasUrl}
                                                inProxy={``}
                                                outProxy={``}
                                                experiment={this.state.experimentAccession}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const render = (target) => {
    ReactDOM.render(
        <ExperimentPicker />,
        typeof target === `string` ? document.getElementById(target) : target
    );
};

export {render};

