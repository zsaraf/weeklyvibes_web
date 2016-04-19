'use strict';

import React from 'react';
import $ from 'jquery';

require('jquery-ui');

class Header extends React.Component{

    constructor(props) {
        super(props);
    }

    mobileShift(e) {

        var className = '';

        if (e.target.id == 'mobile-filter-button') {
            className = 'open-left';
        } else {
            className = 'open-right';
        }

        $('.mobile-shift').toggleClass(className);
    }

    render() {
        return (
            <div id='header' className='mobile-shift'>
                <div id='mobile-filter-button' onClick={this.mobileShift.bind(this)}/>
                <div id='mobile-event-playlist-button' onClick={this.mobileShift.bind(this)}/>
            </div>
        );
    }

}

export default Header;
