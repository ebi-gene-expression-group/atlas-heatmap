import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class GenomeBrowsersDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange(eventKey, event) {
        event.preventDefault();
        this.props.onSelect(eventKey);
    }

    _genomeBrowserIcon(genomeBrowser) {
        switch (genomeBrowser) {
            case `none`:
                return `eye-close`;
            default:
                return `eye-open`;
        }
    }

    render() {
        const genomeBrowsers =
            [
                {
                    id: `none`,
                    label: `No genome browser selected`
                },
                ...this.props.genomeBrowsers.map(genomeBrowserName => ({
                    id: genomeBrowserName.replace(/\s+/g, ``).toLowerCase(),
                    label: `${genomeBrowserName} genome browser`
                }))
            ];

        return (
            <div>
                <Dropdown id="genome-browsers-dropdown"
                          onSelect={(key, e) => this.handleChange(key, e)}
                          title={`Choose genome browser`}>

                    <Dropdown.Toggle bsSize="small"
                                     style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                        <Glyphicon glyph={this._genomeBrowserIcon(this.props.selected)}
                        /> {genomeBrowsers.find(gb => this.props.selected === gb.id).label}
                    </Dropdown.Toggle>

                    <Dropdown.Menu bsSize="small">
                        {genomeBrowsers.map(gb =>
                            <MenuItem style={{listStyleImage: `none`}} key={gb.id} eventKey={gb.id} href="#">
                                {gb.label}
                            </MenuItem>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }

}

GenomeBrowsersDropdown.propTypes = {
    genomeBrowsers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    selected: React.PropTypes.string,
    onSelect: React.PropTypes.func
};

export default GenomeBrowsersDropdown;