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
        const { isChecked } = this.state;

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
            selected: []
        }
    }

    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
    }

    componentDidMount = () => {
        this.handleCurrentCheckboxSelection()
    }

    _updateFiltersSelected = (checked) => {
        this.setState({selected: checked});

    }

    toggleCheckbox = label => {
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
        const {onChangeCurrentValues, values} = this.props

        const checkboxesSelected = []
        for (const checked of this.selectedCheckboxes) {
            checkboxesSelected.push(checked)
        }

        this._updateFiltersSelected(checkboxesSelected)

        const filteredValues = values.filter(item => checkboxesSelected.length > 0 ?
            checkboxesSelected
                .map(val => item.categories.indexOf(val))
                .map(val => (val > -1))
                .reduce((acc, cum) => acc && cum) : ""
        );

        onChangeCurrentValues(filteredValues)
    }

    handleCurrentCheckboxSelection = () => {
        const {currentValues, categories} = this.props

        const currentChecked = []
        let existCategory = true;

        categories.forEach(category => {
            currentValues.forEach(value => {
                if (!value.categories.includes(category.name)) {
                    existCategory = false
                }
            });

            if (existCategory) {
                currentChecked.push(category.name)
            }

            existCategory = true;
        });


        this._updateFiltersSelected(currentChecked);

    }

    createCheckbox = (label) => {
        const {selected} = this.state;
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
    values: PropTypes.arrayOf(groupedColumnPropTypes).isRequired,
    currentValues: PropTypes.arrayOf(groupedColumnPropTypes).isRequired,
    onChangeCurrentValues: PropTypes.func.isRequired
    // onChangedFilters: PropTypes.func.isRequired,
}

export default CategoryCheckboxes
