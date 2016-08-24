'use strict';

import React from 'react';
import $ from 'jquery';

class Header extends React.Component{

    constructor(props) {
        super(props);
    }

    nowPlayingHit(e) {
        e.preventDefault();
        $('#center-content-wrapper').removeClass('playlist-open');
    }

    playlistHit(e) {
        e.preventDefault();
        $('#center-content-wrapper').addClass('playlist-open');

    }

    render() {
        return (
            <div id='header'>
                <div id='logo'></div>
                <div className='header-button' onClick={this.props.nowPlayingHit}>Now Playing</div>
                <div className='header-button' onClick={this.props.playlistHit}>Playlist</div>
            </div>
        );
    }

}

export default Header;
