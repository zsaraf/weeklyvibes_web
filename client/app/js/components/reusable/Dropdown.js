'use strict';

import React from 'react';
import * as VelocityAnimate     from 'velocity-animate';
import * as VelocityAnimateUI   from 'velocity-animate/velocity.ui';
import { VelocityComponent, VelocityTransitionGroup }    from 'velocity-react';

class DropdownItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='dropdown-item' onClick={this.props.selector}>
                {this.props.title}
            </div>
        );
    }
}

class Dropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            isOpen: false
        }
    }

    showOptionClicked(e) {
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.preventDefault();
        console.log('Called showOptionClicked');
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    showOptionItemClicked(e, index) {
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.preventDefault();
        this.setState({
            isOpen: !this.state.isOpen,
            selectedIndex: index
        });

        // Call callback
        this.props.onChange(index);
    }

    componentDidMount() {
        window.addEventListener('click', function() {
            console.log('window watcher called');
            if (this.state.isOpen) {
                this.setState({
                    isOpen: false
                });
            }
        }.bind(this));
    }

    render() {

        var dropdownItems = this.props.options.map(function(option, i) {
            if (i == this.state.selectedIndex) return;
            return (
                <DropdownItem
                    key={i}
                    index={i}
                    title={option}
                    selector={(e) => this.showOptionItemClicked(e, i)}
                />
            )
        }.bind(this));

        var hiddenOptions = (this.state.isOpen) ? (
            <div className='hidden-options' style={initialHide} ref={(c) => this._hiddenOptions = c }>
                <div className='hidden-options-header'></div>
                {dropdownItems}
            </div>
        ) : null;

        var showOption = this.props.options[this.state.selectedIndex];

        var initialHide = {
            display: (this.state.isOpen) ? 'block' : 'none'
        }

        var className = 'dropdown';
        if (this.state.isOpen) className += ' open';
        else className += ' closed';

        return (
            <div className={className}>
                <div className='show-option' onClick={(event) => this.showOptionClicked(event)} ref={(c) => this._showOption = c }>
                    {showOption}
                </div>
                <VelocityTransitionGroup enter={{animation: {opacity: [1, 0]}, easing: [400, 40], delay: 0}} leave={{animation: {opacity: 0}}} duration={500} runOnMount={true}>
                    {hiddenOptions}
                </VelocityTransitionGroup>
            </div>
        );
    }

}

export default Dropdown;
