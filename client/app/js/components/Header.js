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
            $('#event-playlist').zIndex(-1);
            $('#filter-bar').zIndex(0);

        } else {
            className = 'open-right';
            $('#event-playlist').zIndex(0);
            $('#filter-bar').zIndex(-1);
        }

        $('.mobile-shift').toggleClass(className);
    }

    componentDidMount() {
        $(window).resize(function () {
            if ($(document).width >= 1000) {
                console.log('here');
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
                <div id='mobile-event-playlist-button' onClick={this.mobileShift.bind(this)}/>
            </div>
        );
    }

}

export default Header;
