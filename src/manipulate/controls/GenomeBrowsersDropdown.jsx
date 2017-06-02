import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class GenomeBrowsersDropdown extends React.Component{

    handleChange(eventKey, event) {
        event.preventDefault();
        this.props.onSelect(event.target.text);
    }

    _genomeBrowserIcon(genomeBrowser) {
        switch (genomeBrowser) {
            case `No genome browser selected`:
                return `eye-close`;
            default:
                return `eye-open`;
        }
    }

    render() {
        return (
            <div>
                <Dropdown id="genome-browsers-dropdown"
                          onSelect={(key, e) => this.handleChange(key, e)}
                          title={`Choose genome browser`}>

                    <Dropdown.Toggle bsSize="small"
                                     style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
                        <Glyphicon glyph={this._genomeBrowserIcon(this.props.selected)} /> {this.props.selected}
                    </Dropdown.Toggle>

                    <Dropdown.Menu bsSize="small">
                        {this.props.genomeBrowsers.map(genomeBrowser =>
                            <MenuItem style={{listStyleImage: `none`}} key={genomeBrowser} href="#">
                                {genomeBrowser}
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
    onSelect: React.PropTypes.func,
};

export default GenomeBrowsersDropdown;