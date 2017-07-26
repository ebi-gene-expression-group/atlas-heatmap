import React from 'react'
import PropTypes from 'prop-types'
import {groupedColumnsPropTypes} from '../../chartDataPropTypes.js'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
require("./NavPills.css")
import GroupingFilter from './GroupingFilter.js'

import uncontrollable from 'uncontrollable'

const tabs = (className, style={}, aStyle={}) => (
	({allTabs, currentTab, onChangeCurrentTab}) => (
		<ul className={className} style={style}>
		{
			allTabs.map(tab => (
			   <li key={tab}
				   className={tab==currentTab ? "active" : ""}>
				   <a href="#" onClick={ onChangeCurrentTab.bind(this, tab)} style={aStyle}>
					   {tab}
				   </a>
			   </li>
			))
		}
		</ul>
	)
)

const topRibbonTabs = tabs("nav nav-tabs")
const categoryTabs = tabs("nav nav-pills",{fontSize:"medium"}, {border:"none"})


const _FiltersModal = ({
	showModal,
	onCloseModal,
	tabNames: allTopTabs,
	currentTopTab,
	onChangeCurrentTopTab,
	allCategories,
	currentCategory,
	onChangeCurrentCategory,
	currentSelectedValues,
	onChangeCurrentSelectedValues
	}) => (
	<Modal show={showModal} onHide={onCloseModal} bsSize="large">
		<Modal.Header closeButton>
		{allTopTabs.length > 1
		 ? topRibbonTabs({allTabs:allTopTabs, currentTab:currentTopTab, onChangeCurrentTab:onChangeCurrentTopTab})
		 : <h4 className="modal-title"> Filters </h4>
		}
		</Modal.Header>

		<Modal.Body >
			{
				categoryTabs({allTabs: allCategories.map(c => c.name), currentTab:currentCategory, onChangeCurrentTab:onChangeCurrentCategory})
			}
			{
				false && <GroupingFilter/>
			}

		</Modal.Body>

		<Modal.Footer>
			<Button onClick={onCloseModal}
					style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
				Close
			</Button>
		</Modal.Footer>
	</Modal>
)

const FiltersModal = uncontrollable(_FiltersModal, {
	currentTopTab : `onChangeCurrentTopTab`,
	currentCategory: `onChangeCurrentCategory`,
})

const FiltersButton = ({disabled,onClickButton}) => (
	<Button bsSize="small" onClick={onClickButton} disabled={disabled}
			title={disabled ? `Reset zoom to enable filters` : ``}
			style={{textTransform: `unset`, letterSpacing: `unset`, height: `unset`}}>
		<Glyphicon glyph="equalizer"/>
		<span style={{verticalAlign: `middle`}}> Filters</span>
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
			defaultCurrentTopTab={props.tabNames[0] || ""}
			defaultCurrentCategory={(props.allCategories[0] || {name:""}).name}
			/>
	</div>
)

_Main.propTypes = {
	allCategories: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		disabled: PropTypes.bool.isRequired
	})).isRequired,
	allValues: PropTypes.arrayOf(PropTypes.string).isRequired,
	currentValues: PropTypes.arrayOf(PropTypes.string).isRequired,
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
