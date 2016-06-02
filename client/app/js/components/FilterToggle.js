'use strict';

import React from 'react';

class FilterToggle extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='filter-toggle'>
                {this.props.text}
            </div>
        );
    }

}

export default FilterToggle;
