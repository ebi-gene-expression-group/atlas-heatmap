/*
 This class is a wrapper around react-tooltip that lets us have one big tooltip.
 The tooltip gets hidden when you hover off, and changes content when you change what you hover on.

 Used to work with major hacks.
 After Alfonso rewrote it it has fewer hacks but doesn't work when you change hover between labels instead of on/off
 The problems come from needing the frozen property which we won't soon - no column labels.
 Currently unused and broken :(
 It will still be good for showing the gene tooltip which is a fine piece of work and high utility.
 TODO restore
 */

import React from 'react';
import ReactTooltip from 'react-tooltip';
import './TooltipStateManager.less';

class TooltipStateManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showTooltip: false,
            onHoverElementType: ``,
            onHoverElementIndex: 0,
            tooltipFrozen: false
        };

        this.onHover = this._onHover.bind(this);
        this.onClick = this._onClick.bind(this);
        this.getTooltipContent = this._getTooltipContent.bind(this);
        this.dismissTooltip = this._dismissTooltip.bind(this);
    }

    _dismissTooltip() {
        this.setState({ tooltipFrozen: false, showTooltip: false });
    }

    _onClick(elementType, elementIndex) {
        if(this.props.enableFreeze) {
            this.setState(previousState => {
                const sameSelection =
                    previousState.onHoverElementType === elementType &&
                    previousState.onHoverElementIndex === elementIndex;

                return sameSelection ?
                    { tooltipFrozen: !previousState.tooltipFrozen } :
                    {
                        tooltipFrozen: true,
                        onHoverElementType: elementType,
                        onHoverElementIndex: elementIndex
                    }
            })
        }
    }

    _onHover(showTooltip, elementType, elementIndex) {
        if (!this.state.tooltipFrozen) {
            this.setState({
                showTooltip: showTooltip,
                onHoverElementType: elementType,
                onHoverElementIndex: elementIndex
            });
        }
    }

    _getTooltipContent() {
        if (!this.state.showTooltip) {
            return null;
        }

        switch (this.state.onHoverElementType) {
            case `xAxisLabel`:
                this.props.onHoverColumn(this.state.onHoverElementIndex);
                return this.props.tooltips.column(this.state.onHoverElementIndex);
            case `yAxisLabel`:
                this.props.onHoverRow(this.state.onHoverElementIndex);
                return this.props.tooltips.row(this.state.onHoverElementIndex);
            // We let Highcharts manage the point formatter for now since we're not disappointed.
            // case `point`: ...
            default:
                return null;
        }
    }

    render () {
        const ManagedComponent = this.props.managedComponent;

        return (
            <div>
                <div data-tip data-for="gxaGlobalTooltipOverManagedComponent"
                     className={this.state.tooltipFrozen ? `gxaFadeBackgroundForOpenTooltip` : ``}>
                    <ManagedComponent {...this.props.managedComponentProps}
                                      onHover={this.onHover}
                                      onClick={this.onClick}
                    />
                </div>

                <ReactTooltip id="gxaGlobalTooltipOverManagedComponent"
                              type="light"
                              frozen={this.state.tooltipFrozen}
                              onClickOutside={this.props.enableFreeze ? this.dismissTooltip : undefined}
                              getContent={this.getTooltipContent}
                              place={`bottom`}
                />
            </div>
        )
    }
}

TooltipStateManager.props = {
    managedComponent: React.PropTypes.any.isRequired,
    managedComponentProps: React.PropTypes.object.isRequired,
    onHoverRow: React.PropTypes.func.isRequired,
    onHoverColumn: React.PropTypes.func.isRequired,
    onHoverPoint: React.PropTypes.func.isRequired,
    tooltips: React.PropTypes.shape({
        row: React.PropTypes.func,
        column: React.PropTypes.func,
        point: React.PropTypes.func
    }).isRequired,
    enableFreeze: React.PropTypes.bool.isRequired
};

export default TooltipStateManager;
