'use strict';

import React from 'react';

class EventPlaylistNode extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        console.log(this.props.event);

        return (
            <div className='event-playlist-node'>
                <div className='left-content'>
                    <div className='artist-img-wrapper'>
                        <img src={this.props.event.eventArtists[0].artist.imgSrc} />

                    </div>
                </div>
                <div className='right-content'>
                    <div className='name'>
                        {this.props.event.name}
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
                return (
                    <EventPlaylistNode
                        event={e}
                        key={e.id}
                    />
                );
            });
        }

        return (
            <div id='event-playlist'>
                {eventPlaylistNodes}
            </div>
        );
    }

}

export default EventPlaylist;
