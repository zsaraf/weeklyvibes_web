'use strict';

import React from 'react';


class EventPlaylistNode extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        return

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
                )
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