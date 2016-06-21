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
import PlaybackActions  from '../actions/PlaybackActions';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    onEventStoreChanged(err, currentEvent, filteredEvents, filteredVenues, filteredDays) {
        if (err) {
            console.log(err);
        } else {
            PlaybackActions.addEventsToQueue(filteredEvents);
            PlaybackActions.play();

            this.setState({
                loading: false,
            });
        }
    }

    componentDidMount() {
        this.unsubscribeEvents = EventStore.listen(this.onEventStoreChanged.bind(this));
        var parts = location.hostname.split('.');
        var subdomain = parts.shift();
        EventActions.getEvents(subdomain);
    }

    componentWillUnmount() {
        this.unsubscribeEvents();
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
                    <Header />
                    <EventDetail />
                    <EventPlaylist />
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
