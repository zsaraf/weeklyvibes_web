'use strict';

import React            from 'react';
import $                from 'jquery';
import Link             from 'react-router';
import DocumentTitle    from 'react-document-title';
import Player           from '../components/Player';
import FilterBar        from '../components/FilterBar';
import EventPlaylist    from '../components/EventPlaylist';
import EventDetail      from '../components/EventDetail';
import Loading          from '../components/Loading';
import Header           from '../components/Header';
import EventActions     from '../actions/EventActions';
import EventStore       from '../stores/EventStore';
import moment           from 'moment-timezone';
import SongQueue        from '../utils/SongQueue';
import WVUtils          from '../utils/WVUtils';
import PlaybackActions  from '../actions/PlaybackActions';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            playlistOpen: false,
            playlistShouldClose: false
        };
    }

    onEventStoreChanged(err, currentEvent, filteredEvents, filteredVenues, filteredDays) {
        if (err) {
            console.log(err);
        } else {
            if (this.state.loading) {
                PlaybackActions.addCurrentEventAndFutureToQueueFromSong(currentEvent.eventArtists[0].artist.songs[0]);

                this.setState({
                    loading: false,
                });
            } else if (this.state.playlistShouldClose) {
                this.setState({
                    playlistOpen: false,
                    playlistShouldClose: false
                });
            }
        }
    }

    componentDidMount() {
        this.unsubscribeEvents = EventStore.listen(this.onEventStoreChanged.bind(this));
        var parts = location.hostname.split('.');
        var subdomain = parts.shift();
        EventActions.getEvents(subdomain, this.props.params.eventId);
    }

    componentWillUnmount() {
        this.unsubscribeEvents();
    }

    nowPlayingHit(e) {
        e.preventDefault();
        this.setState({
            playlistOpen: false,
        });

    }

    playlistHit(e) {
        e.preventDefault();
        this.setState({
            playlistOpen: true,
        });
    }

    eventSelected(event) {
        this.setState({
            playlistShouldClose: true
        });
        EventActions.eventSelected(event);
    }

    render() {
        var loading = (this.state.loading) ? (<Loading />) : null;

        var centerContentClass = (this.state.playlistOpen) ? 'playlist-open' : null;

        return (
            <DocumentTitle title="Weekly Vibes">
                <div id="home-page">
                    <Header
                        playlistOpen={this.state.playlistOpen}
                        nowPlayingHit={this.nowPlayingHit.bind(this)}
                        playlistHit={this.playlistHit.bind(this)} />

                    <div id='center-content-wrapper' className={centerContentClass}>
                        <FilterBar />
                        <EventDetail />
                        <EventPlaylist
                            eventSelected={this.eventSelected.bind(this)} />

                    </div>
                    <Player />
                    {loading}
                </div>
            </DocumentTitle>
        );
    }
}

export default HomePage;
