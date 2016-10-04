'use strict';

import React from 'react';
import Modal from 'react-modal';
import $ from 'jquery';

const modalStyles = {
    overlay: {
        position: 'fixed',
        top
    },
    content: {
        width                 : '20%',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
}

class Header extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        var showModal= false;
        var modal = (showModal) ? (
            <Modal
              isOpen={true}
              onRequestClose={this.closeModal}
              className="about-modal"
              overlayClassName="about-modal-overlay">

                <div>
                    Made with love by franz, beezy, and vibes
                </div>
             </Modal>
        ) : null;

        var nowPlayingClass = (this.props.playlistOpen) ? '' : 'active';
        var playlistClass = (this.props.playlistOpen) ? 'active' : '';
        return (
            <div id='header'>
                <div id='logo'></div>
                <div className='buttons'>
                    <div className='header-button' className={'header-button ' + nowPlayingClass} onClick={this.props.nowPlayingHit}>Now Playing</div>
                    <div className='header-button' className={'header-button ' + playlistClass} onClick={this.props.playlistHit}>Playlist</div>
                </div>
                {modal}
            </div>
        );
    }

}

export default Header;
