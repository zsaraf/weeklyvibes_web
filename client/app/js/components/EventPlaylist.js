'use strict';

import React from 'react';
import CenteredImage from './CenteredImage';
import moment from 'moment-timezone';
import $ from 'jquery';
import WVUtils from '../utils/WVUtils';

class EventPlaylistNode extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var eventPlaylistNodeClasses = 'event-playlist-node';
        if (this.props.isSelected) {
            eventPlaylistNodeClasses += ' selected';
        }

        var forDate = moment.tz(this.props.event.startDt, this.props.event.venue.timezone).format('dddd');

        return (
            <div className={eventPlaylistNodeClasses} onClick={() => this.props.eventSelected(this.props.event.id)}>
                <div className='left-content'>
                    <div className='artist-img-wrapper'>
                        <CenteredImage
                            imgSrc={this.props.event.eventArtists[0].artist.imgSrc}
                            id={this.props.event.id}
                        />
                    </div>
                </div>
                <div className='right-content'>
                    <div className='top'>
                        <div className='name'>
                            {this.props.event.eventArtists[0].artist.name}
                        </div>
                    </div>
                    <div className='bottom'>
                        <div className='venue-name'>
                            {this.props.event.venue.name}
                        </div>
                        <span>•</span>
                        <div className='for-date'>
                            {forDate}
                        </div>
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

    eventSelected(eventId) {
        var eventObject = this.refs['eventPlaylistNode' + eventId].props.event;
        this.props.eventSelected(eventObject);
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
                        ref={'eventPlaylistNode' + e.id}
                        eventSelected={this.eventSelected.bind(this)}
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
