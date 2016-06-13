'use strict';

import React            from 'react';
import $                from 'jquery';
import Link             from 'react-router';
import DocumentTitle    from 'react-document-title';
import Player           from '../components/Player';
import FilterBar        from '../components/FilterBar';
import EventPlaylist    from '../components/EventPlaylist';
import EventDetail      from '../components/EventDetail';
import Header           from '../components/Header';
import EventActions     from '../actions/EventActions';
import EventStore       from '../stores/EventStore';
import moment           from 'moment-timezone';
import SongQueue        from '../utils/SongQueue';
import WVUtils          from '../utils/WVUtils';
import _                from 'lodash';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            filteredEvents: null,
            filteredDays: EventStore.days,
            filteredVenues: null,
            currentEvent: null,
            songQueue: null,
            currentSong: null,
        };
    }

    onEventsChange(err, events, venues) {
        if (err) {
            console.log(err);
        } else {
            var songQueue = new SongQueue(events[0]);

            this.setState({
                loading: false,
                filteredEvents: events,
                filteredVenues: venues,
                currentEvent: events.length > 1 ? events[0] : null,
                songQueue: songQueue,
                currentSong: songQueue.getCurrentSong(),
                positionInSongQueue: 0
            });
        }
    }

    componentDidMount() {
        this.unsubscribe = EventStore.listen(this.onEventsChange.bind(this));
        var parts = location.hostname.split('.');
        var subdomain = parts.shift();
        EventActions.getEvents(subdomain);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    backgroundImageClicked() {
        if (!this.state.loading) {
            if ($('#jplayer').data().jPlayer.status.paused) {
                $('#jplayer').jPlayer('play');
            } else {
                $('#jplayer').jPlayer('pause');
            }
        }
    }

    eventSelected(e) {
        this.state.songQueue.replaceQueueWithEvent(e);
        var currentSong = this.state.songQueue.getCurrentSong();

        this.setState({
            currentEvent: e,
            currentSong: currentSong
        });
    }

    dayToggled(day) {
        var filteredDays = this.state.filteredDays.slice();
        WVUtils.toggle(day, filteredDays);

        this.setState({
            filteredDays: filteredDays
        });

        this.updateFilteredEvents(this.state.filteredVenues, filteredDays);

        console.log(day);
    }

    venueToggled(venue) {
        var filteredVenues = this.state.filteredVenues.slice();
        WVUtils.toggle(venue, filteredVenues);
        console.log(filteredVenues);
        this.setState({
            filteredVenues: filteredVenues
        });

        this.updateFilteredEvents(filteredVenues, this.state.filteredDays);
    }

    updateFilteredEvents(filteredVenues, filteredDays) {
        var filteredEvents = [];

        EventStore.events.map(function (e) {
            var venue = e.venue;
            var day = moment(e.startDt).format('dddd');

            var dayFilter = filteredDays.indexOf(day) != -1;
            var venueFilter = _.find(filteredVenues, function (v) {
                return _.isEqual(venue, v);
            }) !== undefined;

            // console.log(venueFilter);

            if (dayFilter && venueFilter) {
                filteredEvents.push(e);
            }
        }, this, filteredEvents);

        this.setState({
            filteredEvents: filteredEvents,
            filteredVenues: filteredVenues,
            filteredDays: filteredDays
        });
    }

    nextSongHit(e) {

        var nextSong = this.state.songQueue.getNextSong();
        var currentEvent = this.state.currentEvent;
        if (nextSong == null) {
            // Queue up the next event
            var nextEventIndex = WVUtils.getIndexOfEventInEvents(this.state.currentEvent, this.state.filteredEvents) + 1;
            if (nextEventIndex >= this.state.filteredEvents.length) {
                console.log('We\'ve run out of songs');
                currentEvent = this.state.filteredEvents[0];
                this.state.songQueue.replaceQueueWithEvent(currentEvent);
                nextSong = this.state.songQueue.getCurrentSong();
            } else {
                currentEvent = this.state.filteredEvents[nextEventIndex];
                this.state.songQueue.replaceQueueWithEvent(currentEvent);
                nextSong = this.state.songQueue.getCurrentSong();
            }
        }

        this.setState({
            currentSong: nextSong,
            currentEvent: currentEvent
        });
    }

    previousSongHit(e) {
        var currentSong = this.state.currentSong;
        var previousSong = this.state.songQueue.getPreviousSong();
        var currentEvent = this.state.currentEvent;

        if (previousSong.id == currentSong.id) {
            // The event has hit button
            // Queue up the next event
            var prevEventIndex = WVUtils.getIndexOfEventInEvents(currentEvent, this.state.filteredEvents) - 1;
            if (prevEventIndex >= 0) {
                currentEvent = this.state.filteredEvents[prevEventIndex];
                this.state.songQueue.replaceQueueWithEvent(currentEvent);
                previousSong = this.state.songQueue.getCurrentSong();
            }
        }

        this.setState({
            currentSong: previousSong,
            currentEvent: currentEvent
        });
    }

    render() {
        var loading = null;
        if (this.state.loading) {
            loading = (
                <div className='loading-wrapper'>
                    <div className='loading'>GATHERING VIBE TRIBES...</div>
                </div>
            );

        }

        return (
            <DocumentTitle title="Weekly Vibes">
                <div id="home-page">
                    <Header
                    />
                    <FilterBar
                        filteredVenues={this.state.filteredVenues}
                        filteredDays={this.state.filteredDays}
                        dayToggled={(day) => this.dayToggled(day)}
                        venueToggled={(venue) => this.venueToggled(venue)}
                    />
                    <EventDetail
                        currentEvent={this.state.currentEvent}
                    />
                    <EventPlaylist
                        currentEvent={this.state.currentEvent}
                        eventSelected={this.eventSelected.bind(this)}
                        filteredEvents={this.state.filteredEvents}
                    />
                    <Player
                        loading={this.state.loading}
                        nextSongHit={this.nextSongHit.bind(this)}
                        previousSongHit={this.previousSongHit.bind(this)}
                        song={this.state.currentSong}
                    />
                    {loading}
                </div>
            </DocumentTitle>
        );
    }
}

export default HomePage;
