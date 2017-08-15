import React from 'react'
import PropTypes from 'prop-types'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import xor from 'lodash/xor'
import './Filter.css'
import uncontrollable from 'uncontrollable'

const _FilterOption = ({
    name,
    allValues,
    currentValues,
    isOpen,
    onChangeIsOpen,
    onChangeCurrentValues
}) => {
    const allChecked = allValues.every(v => currentValues.includes(v))
    const allUnchecked = allValues.every(v => !currentValues.includes(v))

    const openable = allValues.length !== 1 || allValues[0] !==name
    return (
        <div>
            <input type={`checkbox`}
                   style={{margin: `10px 0 0 `}}
                   value={name}
                   onChange={
                       onChangeCurrentValues.bind(this, xor(allValues, currentValues).length ? allValues: [])
                   }
                   checked={allChecked}
                   ref={checkbox => {checkbox ? checkbox.indeterminate = !allChecked && !allUnchecked : null}} />

            <div onClick={openable ? onChangeIsOpen.bind(this, !isOpen) : () => {}}
                 href={`#`}
                 className={`gxaCapitalize gxaInline gxaPaddingLeftSmall`}>{name}
                 {openable && <Glyphicon style={{fontSize: `x-small`, paddingLeft: `5px`}} glyph={isOpen ? `menu-up` : `menu-down`}/>}
            </div>

            {openable && isOpen &&
            <div>
                {allValues.map(value => (
                    <div key={value} style={{marginLeft: `20px`, fontSize: `smaller`}}>
                      <input type={`checkbox`}
                             value={value}
                             onChange={onChangeCurrentValues.bind(this, xor([value], currentValues))}
                             checked={currentValues.includes(value)}
                             style={{margin: `0`}}/>
                      <span> {value}</span>
                    </div>
                ))}
            </div>
            }
        </div>
    )
}

_FilterOption.propTypes = {
    name: PropTypes.string.isRequired,
    allValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChangeCurrentValues: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onChangeIsOpen: PropTypes.func.isRequired,
}

const FilterOption = uncontrollable(
    _FilterOption, {
        isOpen: `onChangeIsOpen`
    }
)

FilterOption.defaultProps = {
    defaultIsOpen: false
}

export default FilterOption
