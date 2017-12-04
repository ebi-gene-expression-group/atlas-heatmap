import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {columnCategoryPropTypes, groupedColumnPropTypes} from '../../chartDataPropTypes.js'

class Checkbox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isChecked: this.props.value
        }
    }

    componentDidMount = () => {
        this.setState({
            isChecked: this.props.value
        })
    }

    toggleCheckboxChange = () => {
        const { handleCheckboxChange, label } = this.props;

        this.setState(({isChecked}) => (
            {
                isChecked: !isChecked
            }
        ));

        handleCheckboxChange(label);
    }

    render() {
        const { label, actualValue, indeterminate } = this.props;
        const { isChecked } = this.state.isChecked ? this.state.isChecked : actualValue;

        return (
            <div className="checkbox" style={{float: 'left'}}>
                <input type={`checkbox`}
                       value={label}
                       checked={actualValue}
                       onChange={this.toggleCheckboxChange.bind(this)}
                       ref={checkbox => {checkbox ? checkbox.indeterminate = indeterminate : null}}
                />

                <label>{label}</label>
            </div>
        )
    }
}

Checkbox.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    actualValue: PropTypes.bool.isRequired,
    indeterminate: PropTypes.bool.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
};


class CategoryCheckboxes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            unselected: [],
            indeterminate: []
        }
    }

    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
    }

    componentDidMount = () => {
        this.handleCurrentCheckboxSelection()
    }

    _updateFiltersSelected = (checked, unchecked) => {
        this.setState({
            selected: checked,
            unselected: unchecked});

    }

    toggleCheckbox = label => {
        const {selected} = this.state

        //First time is empty
        if (this.selectedCheckboxes.size === 0) {
            selected.forEach(item => this.selectedCheckboxes.add(item))
        }
        //Checks if a specific checkbox label is in the set
        if (this.selectedCheckboxes.has(label)) {
            this.selectedCheckboxes.delete(label);
        } else {
            this.selectedCheckboxes.add(label);
        }

        //For all the selectedCheckboxes set, we need to update the filters
        this.handleFiltersSelection();
    }

    handleFiltersSelection = () => {
        const {onChangeCurrentValues, allValues} = this.props

        let checkboxesSelected = []

        for (const checked of this.selectedCheckboxes) {
            !checkboxesSelected.includes(checked) ? checkboxesSelected.push(checked) : null
        }

        this._updateFiltersSelected(checkboxesSelected)

        const filteredValues = allValues.filter(item => checkboxesSelected.length > 0 ?
            checkboxesSelected
                .map(val => item.categories.indexOf(val))
                .map(val => (val > -1))
                .reduce((acc, cum) => acc || cum) : ""
        );

        onChangeCurrentValues(filteredValues)
    }

    _manageCheckedCategories = (currentValues, categories) => {
        const commonCategories = []
        let existCurrentCategory = false;

        categories.forEach(category => {
            currentValues.forEach(value => {
                if (value.categories.includes(category.name)) {
                    existCurrentCategory = true
                }
            });

            if (existCurrentCategory) {
                commonCategories.push(category.name)
            }

            existCurrentCategory = false;
        });

        return commonCategories;
    }

    _manageUncheckedCategories = (allValues, currentValues) => {
        let uncheckedCategories = []

        allValues.forEach(value => {
            if (!currentValues.includes(value)) { //value is unchecked
                //uncheckCategories array does not contain value categories
                value.categories.forEach(item => {
                    if (!uncheckedCategories.includes(item)) {
                        uncheckedCategories.push(item)
                    }
                })
            }
        });

        return uncheckedCategories;
    }

    handleCurrentCheckboxSelection = () => {
        const {currentValues, allValues, categories, currentTab} = this.props

        const commonCategories = this._manageCheckedCategories(currentValues, categories);
        const uncheckedCategories = this._manageUncheckedCategories(allValues, currentValues);

        const checkedCategories = []
        //Some of the values have more than one category, but only one is selected, in this case we need to check
        //that this category isn't in the unchecked ones
        commonCategories.forEach(category => {
            !uncheckedCategories.includes(category) && currentTab === "" ? checkedCategories.push(category) : ""
        })

        this._updateFiltersSelected(checkedCategories, uncheckedCategories);

    }

    _manageIndeterminates = (allValues, currentValues, categories, selected) => {
        const commonCategories = this._manageCheckedCategories(currentValues, categories);
        const uncheckedCategories = this._manageUncheckedCategories(allValues, currentValues);

        //Some of the values have more than one category, but only one is selected, in this case we need to check
        //that this category isn't in the unchecked ones
        const realCommonCategories = commonCategories.filter(e => selected.includes(e))

        let indeterminateCategories = []

        realCommonCategories.forEach(category => {
            uncheckedCategories.includes(category)  ? indeterminateCategories.push(category) : ""
        })

        return indeterminateCategories

        // const v = currentValues.filter(cv => cv.categories.includes("Medium") && !cv.categories.includes("Low"));
    }

    createCheckbox = (label) => {
        const {selected} = this.state;
        const {currentTab} = this.props;
        const {categories, allValues, currentValues} = this.props;

        const value = currentTab === "All" ? true : (currentTab === "None" ? false : (selected ? selected.includes(label) : false))
        const indeterminates = this._manageIndeterminates(allValues, currentValues, categories, selected)

        const indeterminateValue = indeterminates.includes(label);

        return (
            <Checkbox key={label}
                      label={label}
                      value={value}
                      actualValue={value}
                      indeterminate={indeterminateValue}
                      handleCheckboxChange={this.toggleCheckbox}
            />
        )
    }

    createCheckboxes = () => {
        const {categories} = this.props;
        const categories_names = categories.map(c => c.name)

        return (
            categories_names.map(this.createCheckbox.bind(this))
        )
    }

    render() {
        return (
            <div className={`columns small-9`}>
                {this.createCheckboxes()}
            </div>
        )
    }
}

CategoryCheckboxes.propTypes = {
    categories: PropTypes.arrayOf(columnCategoryPropTypes).isRequired,
    allValues: PropTypes.arrayOf(groupedColumnPropTypes).isRequired,
    currentValues: PropTypes.arrayOf(groupedColumnPropTypes).isRequired,
    currentTab: PropTypes.string.isRequired,
    onChangeCurrentValues: PropTypes.func.isRequired
}

export default CategoryCheckboxes
