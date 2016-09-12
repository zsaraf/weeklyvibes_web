'use strict';

import React from 'react';

class SegmentedControl extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0
        };
    }

    itemSelected(index) {
        this.setState({
            selectedIndex: index
        });
        this.props.indexSelected(index);
    }

    render() {
        var count = -1;
        var segmentItems = (this.props.titles) ? this.props.titles.map(function (segment) {
            count++;
            var cls = (this.state.selectedIndex == count) ? ' selected' : '';
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
