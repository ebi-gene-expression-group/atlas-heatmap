import React from 'react'
import PropTypes from 'prop-types'
import {Modal, Button, Glyphicon, Nav, NavItem} from 'react-bootstrap/lib'

import {groupedColumnPropTypes,columnCategoryPropTypes} from '../../chartDataPropTypes.js'

import FilterOption from './FilterOption.js'
import {sortBy} from 'lodash'

import '../controlButton.css'

import {groupIntoPairs} from '../../../utils.js'

import uncontrollable from 'uncontrollable'

const navTabs = (className) => (
  ({allTabs, disabledTabs=[], currentTab, onChangeCurrentTab}) => (
  	// Beware: we’re using a custom nav class, it’s just the same as Bootstrap’s but renamed to avoid clashes with
		// other environemnts where nav is also used
		<Nav bsClass={`gxa-nav`}
			   bsStyle={className}
				 activeKey={currentTab}
				 onSelect={onChangeCurrentTab}
		     style={{fontSize: `medium`}}>
      {
        allTabs.map((tab) => (
					<NavItem eventKey={tab}
									 key={tab}
									 disabled={disabledTabs.includes(tab)}>
              {tab}
					</NavItem>
        ))
      }
		</Nav>
  )
)

const topRibbonTabs = navTabs(`tabs`)
const categoryTabs = navTabs(`pills`)

const _FiltersModal = ({
	showModal,
	onCloseModal,
	tabNames: allTopTabs,
	currentTopTab,
	onChangeCurrentTopTab,
	allCategories,
	currentValues,
	allValues,
	onChangeCurrentValues
}) => (
	<Modal show={showModal}
				 onHide={onCloseModal}
				 bsSize={`large`}
				 style={{opacity: 0.95}} >
		<Modal.Header closeButton>
		{allTopTabs.length > 1
		 ? topRibbonTabs({allTabs: allTopTabs, currentTab: currentTopTab, onChangeCurrentTab: onChangeCurrentTopTab})
		 : <h4 className={`modal-title`}> Filters </h4>
		}
		</Modal.Header>

		<Modal.Body >
			{
				categoryTabs({
					allTabs: allCategories.map(c => c.name),
					disabledTabs: allCategories.filter(c => c.disabled).map(c => c.name),
					currentTab:(allCategories.find(category => allValues.every(value=> (
						currentValues.some(currentValue => currentValue.value === value.value) === value.categories.includes(category.name)
					)) && !category.disabled) || {name: ``}).name,
					onChangeCurrentTab: (categoryName) => onChangeCurrentValues(
						allValues
						.filter(e=>e.categories.includes(categoryName))
					)
				})
			}
			<div style={{marginLeft: `20px`, columnCount: `2`}}>
				{
					sortBy(
						groupIntoPairs(
							[].concat.apply([],
								allValues
								.map(v =>
									(v.groupings.find(g => g.name === currentTopTab) || {values:[]})
									.values
									.map(group => [group.label, v.value])
								)
							),
							`0`
						).map(a => [a[0], [].concat.apply([], a[1].map(aa=> aa[1]))]),
						a => a[0] === `Unmapped` ? `_` : ` ${a[0]}` //makes Unmapped go last
					).map(a => (
						<FilterOption
							key={a[0]}
							name={a[0]}
							allValues={a[1]}
							currentValues={a[1].filter(v => currentValues.some(c=> c.value === v))}
							onChangeCurrentValues={(newCurrentValues) => onChangeCurrentValues(
								allValues.filter(v=>
										a[1].includes(v.value)
										? newCurrentValues.includes(v.value)
										: currentValues.some(c => c.value === v.value)
									)
								)}
						/>
					))
				}
			</div>
		</Modal.Body>

		<Modal.Footer>
			<Button onClick={onCloseModal}
							className={`gxaButtonUnset`}>
				Close
			</Button>
		</Modal.Footer>
	</Modal>
)

const FiltersModal = uncontrollable(_FiltersModal, {
	currentTopTab : `onChangeCurrentTopTab`
})

const FiltersButton = ({disabled,onClickButton}) => (
	<Button bsSize={`small`}
					onClick={onClickButton}
					disabled={disabled}
					title={disabled ? `Reset zoom to enable filters` : ``}
					className={`gxaButtonUnset`}>
		<Glyphicon glyph={`equalizer`}/><span style={{verticalAlign: `middle`}}> Filters</span>
	</Button>
)

const _Main = props => (
	<div>
		<FiltersButton
			{...props}
			onClickButton={props.onChangeShowModal.bind(this, true)}/>
		<FiltersModal
			{...props}
			onCloseModal={props.onChangeShowModal.bind(this, false)}
			defaultCurrentTopTab={props.tabNames[0] || ``}
			defaultCurrentCategory={props.allCategories.find(c => !c.disabled)}
			/>
	</div>
)

_Main.propTypes = {
	allCategories: PropTypes.arrayOf(columnCategoryPropTypes).isRequired,
	allValues: PropTypes.arrayOf(groupedColumnPropTypes).isRequired,
	currentValues: PropTypes.arrayOf(groupedColumnPropTypes).isRequired,
	disabled : PropTypes.bool.isRequired,
	onChangeCurrentValues:PropTypes.func.isRequired,
	tabNames: PropTypes.arrayOf(PropTypes.string).isRequired,
	onChangeShowModal: PropTypes.func.isRequired,
	showModal: PropTypes.bool.isRequired,
}

const Main = uncontrollable(_Main, {
  showModal: `onChangeShowModal`,
})

Main.defaultProps = {
	defaultShowModal: false
}

export default Main
