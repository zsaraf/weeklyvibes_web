'use strict';

import React from 'react';

class SegmentedControl extends React.Component {

    constructor(props) {
        super(props);
    }

    itemSelected(index) {
        this.props.indexSelected(index);
    }

    render() {
        var count = -1;
        var segmentItems = (this.props.titles) ? this.props.titles.map(function (segment) {
            count++;
            var cls = (this.props.selectedIndex == count) ? ' selected' : '';
            return (
                <div className={'segmented-control-item' + cls} key={count} onClick={this.itemSelected.bind(this, count)} >
                    {segment}
                </div>
            );
        }.bind(this)) : null;

        return (
            <div className='segmented-control'>
                {segmentItems}
            </div>
        );
    }

}

export default SegmentedControl;
