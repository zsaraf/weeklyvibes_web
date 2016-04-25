'use strict';

import React from 'react';
import CenteredImage from './CenteredImage';

class EventPlaylistNode extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        console.log(this.props.event);

        var eventPlaylistNodeClasses = 'event-playlist-node';
        if (this.props.isSelected) {
            eventPlaylistNodeClasses += ' selected';
        }

        return (
            <div className={eventPlaylistNodeClasses}>
                <div className='left-content'>
                    <div className='artist-img-wrapper'>
                        <CenteredImage
                            imgSrc={this.props.event.eventArtists[0].artist.imgSrc}
                            id={this.props.event.id}
                        />
                    </div>
                </div>
                <div className='right-content'>
                    <div className='name'>
                        {this.props.event.eventArtists[0].artist.name}
                    </div>
                    <div className='for-date'>
                        {this.props.event.startDt}
                    </div>
                </div>
            </div>
        );
    }
}

class EventPlaylist extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var eventPlaylistNodes = null;
        if (this.props.filteredEvents) {

            eventPlaylistNodes = this.props.filteredEvents.map(function (e) {

                var isSelected = this.props.currentEvent.id == e.id ? true : false;

                return (
                    <EventPlaylistNode
                        event={e}
                        key={e.id}
                        isSelected={isSelected}
                    />
                );
            }.bind(this));
        }

        return (
            <div id='event-playlist'>
                {eventPlaylistNodes}
            </div>
        );
    }

}

export default EventPlaylist;
