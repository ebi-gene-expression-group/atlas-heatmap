import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import './controlButton.css'

class GenomeBrowsersDropdown extends React.Component {
  constructor(props) {
    super(props)
  }

  handleChange(eventKey, event) {
    event.preventDefault()
    this.props.onSelect(eventKey)
  }

  _genomeBrowserIcon(genomeBrowser) {
    switch (genomeBrowser) {
      case `none`:
        return `eye-close`
      default:
        return `eye-open`
    }
  }

  render() {
    const genomeBrowsers =
      [
        {
          id: `none`,
          label: `Select genome browser to view tracks`
        },
        ...this.props.genomeBrowsers.map(genomeBrowserName => ({
          id: genomeBrowserName.replace(/\s+/g, ``).toLowerCase(),
          label: `${genomeBrowserName} genome browser`
        }))
      ]

    return (
      <div>
        <Dropdown id="genome-browsers-dropdown"
                  onSelect={(key, e) => this.handleChange(key, e)}
                  title={`Choose genome browser`}>

          <Dropdown.Toggle bsSize="small"
                           className={`gxaButtonUnset`}>
            <Glyphicon glyph={this._genomeBrowserIcon(this.props.selected)}/>
            &nbsp;{genomeBrowsers.find(gb => this.props.selected === gb.id).label}
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
    )
  }

}

GenomeBrowsersDropdown.propTypes = {
  genomeBrowsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func
}

export default GenomeBrowsersDropdown
