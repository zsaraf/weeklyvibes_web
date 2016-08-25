'use strict';

import React from 'react';
import $ from 'jquery';

class Header extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {

        var nowPlayingClass = (this.props.playlistOpen) ? '' : 'active';
        var playlistClass = (this.props.playlistOpen) ? 'active' : '';
        return (
            <div id='header'>
                <div id='logo'></div>
                <div className='buttons'>
                    <div className='header-button' className={'header-button ' + nowPlayingClass} onClick={this.props.nowPlayingHit}>Now Playing</div>
                    <div className='header-button' className={'header-button ' + playlistClass} onClick={this.props.playlistHit}>Playlist</div>
                </div>
            </div>
        );
    }

}

export default Header;
