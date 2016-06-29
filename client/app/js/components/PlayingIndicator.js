'use strict';

import React from 'react';

class PlayingIndicator extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {

        var classes = 'music-playing';
        if (!this.props.isPlaying) {
            classes += ' paused';
        }

        return (
            <div className={classes}>
                <div className='bar bar1' style={{ height: '15%' }}></div>
                <div className='bar bar2' style={{ height: '75%' }}></div>
                <div className='bar bar3' style={{ height: '25%' }}></div>
                <div className='bar bar4' style={{ height: '90%' }}></div>
            </div>
        );
    }

}

export default PlayingIndicator;
