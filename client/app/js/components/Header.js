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

    componentDidMount() {
        $(window).resize(function () {
            if ($(window).width() >= 1000) {
                if ($('.mobile-shift').hasClass('open-left') || $('.mobile-shift').hasClass('open-right')) {
                    $('.mobile-shift').removeClass('open-left');
                    $('.mobile-shift').removeClass('open-right');
                }
            }
        });

    }

    render() {
        return (
            <div id='header' className='mobile-shift'>
                <div id='mobile-filter-button' onClick={this.mobileShift.bind(this)}/>
                <div id='logo'></div>
                <div id='mobile-event-playlist-button' onClick={this.mobileShift.bind(this)}/>
            </div>
        );
    }

}

export default Header;
