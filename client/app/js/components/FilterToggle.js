'use strict';

import React from 'react';

class FilterToggle extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        var selectedClass = this.props.selected ? 'selected' : '';
        var classes = 'filter-toggle ' + selectedClass + ' ' + this.props.classes;
        return (
            <div className={classes} onClick={() => this.props.clickHandler(this) }>
                <div className='text-wrap'>
                    <div className='text'>
                        {this.props.text}
                    </div>
                </div>
            </div>
        );
    }

}

export default FilterToggle;
