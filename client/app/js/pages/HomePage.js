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
import PlaybackStore    from '../stores/PlaybackStore';
import PlaybackActions  from '../actions/PlaybackActions';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            filteredEvents: null,
            filteredDays: EventStore.days,
            filteredVenues: null,
            currentEvent: null,
        };
    }

    onEventsChange(err, events, venues) {
        if (err) {
            console.log(err);
        } else {
            PlaybackActions.addEventsToQueue(events);
            PlaybackActions.play();

            this.setState({
                loading: false,
                filteredEvents: events,
                filteredVenues: venues,
                currentEvent: events.length > 1 ? events[0] : null,
            });
        }
    }

    playbackChanged(err, currentSong, isPlaying) {
        // console.log('HomePage PlaybackStore triggered');
    }

    componentDidMount() {
        this.unsubscribeEvents = EventStore.listen(this.onEventsChange.bind(this));
        this.unsubscribePlayback = PlaybackStore.listen(this.playbackChanged.bind(this));
        var parts = location.hostname.split('.');
        var subdomain = parts.shift();
        EventActions.getEvents(subdomain);
    }

    componentWillUnmount() {
        this.unsubscribeEvents();
        this.unsubscribePlayback();
    }

    eventSelected(e) {
        this.setState({
            currentEvent: e,
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
                    <EventDetail
                        currentEvent={this.state.currentEvent}
                    />
                    <EventPlaylist
                        currentEvent={this.state.currentEvent}
                        eventSelected={this.eventSelected.bind(this)}
                        filteredEvents={this.state.filteredEvents}
                    />
                    <FilterBar
                        filteredVenues={this.state.filteredVenues}
                        filteredDays={this.state.filteredDays}
                        dayToggled={(day) => this.dayToggled(day)}
                        venueToggled={(venue) => this.venueToggled(venue)}
                    />
                    <Player
                        loading={this.state.loading}
                    />
                    {loading}
                </div>
            </DocumentTitle>
        );
    }
}

export default HomePage;
