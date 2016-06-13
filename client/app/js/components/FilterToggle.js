'use strict';

import React from 'react';

class FilterToggle extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        var selectedClass = this.props.selected ? 'selected' : '';
        var classes = 'filter-toggle ' + selectedClass;
        return (
            <div className={classes} onClick={() => this.props.clickHandler(this) }>
                {this.props.text}
            </div>
        );
    }

}

export default FilterToggle;
