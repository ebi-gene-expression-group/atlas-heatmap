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
        const { label, actualValue } = this.props;
        const { isChecked } = this.state.isChecked ? this.state.isChecked : actualValue;

        return (
            <div className="checkbox" style={{float: 'left'}}>
                <input type="checkbox"
                       value={label}
                       checked={actualValue}
                       onChange={this.toggleCheckboxChange.bind(this)}
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
    handleCheckboxChange: PropTypes.func.isRequired,
};


class CategoryCheckboxes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            unselected: []
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

    handleCurrentCheckboxSelection = () => {
        const {currentValues, allValues, categories} = this.props

        const checkedCategories = []
        let uncheckedCategories = []
        let existCurrentCategory = true;

        categories.forEach(category => {
            //TODO: when two selected and modal is open checkboxes not selected, review this part of the code
            currentValues.forEach(value => {
                if (!value.categories.includes(category.name)) {
                    existCurrentCategory = false
                }
            });

            if (existCurrentCategory) {
                checkedCategories.push(category.name)
            }

            existCurrentCategory = true;
        });

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


        this._updateFiltersSelected(checkedCategories, uncheckedCategories);

    }

    createCheckbox = (label) => {
        const {selected, unselected} = this.state;
        const value = selected ? selected.includes(label) : false

        return (
            <Checkbox key={label}
                      label={label}
                      value={value}
                      actualValue={value}
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
    onChangeCurrentValues: PropTypes.func.isRequired
    // onChangedFilters: PropTypes.func.isRequired,
}

export default CategoryCheckboxes
