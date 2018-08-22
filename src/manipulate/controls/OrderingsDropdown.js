import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'react-bootstrap/lib/Dropdown'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'

import './controlButton.css'

const callWithEventTargetText = (f) => (
  (eventKey, event) => {
    event.preventDefault()
    return f(event.target.text)
  }
)

const orderingIcon = (ordering) => {
  switch (ordering) {
    case `Alphabetical order`:
      return `sort-by-alphabet`
    case `Expression rank`:
      return `sort-by-attributes-alt`
    case `By experiment type`:
      return `sort-by-order`
    default:
      return `sort-by-order`
  }
}

const OrderingsDropdown = ({allOptions,currentOption,onChangeCurrentOption,title,disabled}) => (
  <div>
    <Dropdown id="orderings-dropdown"
              onSelect={callWithEventTargetText(onChangeCurrentOption)}
              {...{title,disabled}}>

      <Dropdown.Toggle bsSize="small"
                       className={`gxaButtonUnset`}>
        <Glyphicon glyph={orderingIcon(currentOption)} />
        {currentOption}
      </Dropdown.Toggle>

      <Dropdown.Menu bsSize="small">
        {allOptions.map(option =>
          <MenuItem style={{listStyleImage: `none`}} key={option} href="#" active={option===currentOption}>
            {option}
          </MenuItem>
        )}
      </Dropdown.Menu>

    </Dropdown>
  </div>
)

OrderingsDropdown.propTypes = {
  allOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentOption: PropTypes.string.isRequired,
  onChangeCurrentOption: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  disabled:PropTypes.bool.isRequired
}

export default OrderingsDropdown
