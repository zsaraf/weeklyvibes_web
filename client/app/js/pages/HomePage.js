'use strict';

import React                    from 'react';
import $                        from 'jquery';
import Link                     from 'react-router';
import DocumentTitle            from 'react-document-title';
import Player                   from '../components/Player';
import FilterBar                from '../components/FilterBar';
import EventPlaylist            from '../components/EventPlaylist';
import EventDetail              from '../components/EventDetail';
import Loading                  from '../components/Loading';
import Header                   from '../components/Header';
import EventActions             from '../actions/EventActions';
import EventStore               from '../stores/EventStore';
import moment                   from 'moment-timezone';
import SongQueue                from '../utils/SongQueue';
import WVUtils                  from '../utils/WVUtils';
import PlaybackActions          from '../actions/PlaybackActions';
import PlaybackStore            from '../stores/PlaybackStore';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import * as VelocityAnimate     from 'velocity-animate';
import * as VelocityAnimateUI   from 'velocity-animate/velocity.ui';
import { VelocityComponent, VelocityTransitionGroup }    from 'velocity-react';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            currentSong: null,
            isPlaying: false,
            playlistOpen: true,
            playlistShouldClose: false,
            loadingAnimationPhase1Finished: false,
            loadingAnimationPhase2Finished: false
        };
    }

    onEventStoreChanged(err, currentEvent, filteredEvents, filteredVenues, filteredDays, selectionStatus, currentEventArtist) {
        if (err) {
            console.log(err);
        } else {
            if (this.state.loading) {
                PlaybackActions.addCurrentEventAndFutureToQueueFromSong(currentEvent.eventArtists[0].artist.songs[0]);
                this.setState({
                    loading: false
                });
            } else if (this.state.playlistShouldClose) {
                this.setState({
                    playlistOpen: false,
                    playlistShouldClose: false
                });
            }
        }
    }

    playbackChanged(err, currentSong, isPlaying) {
        this.setState({
            currentSong: currentSong,
            isPlaying: isPlaying
        });
    }

    componentDidMount() {
        this.unsubscribeEvents = EventStore.listen(this.onEventStoreChanged.bind(this));
        this.unsubscribePlayback = PlaybackStore.listen(this.playbackChanged.bind(this));
        var parts = location.hostname.split('.');
        var subdomain = parts.shift();
        EventActions.getEvents(subdomain, this.props.params.eventId);
    }

    componentWillUnmount() {
        this.unsubscribePlayback();
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
        EventActions.eventEventArtistSelected(event, null);
    }

    render() {
        /* Animation vars */
        const horizontalAnimationDelay = 100;
        const verticalAnimationDelay = 500;
        const defaultEasing = [400, 40];
        var centerContentClass = (this.state.playlistOpen) ? 'playlist-open' : null;

        var documentTitle  = (this.state.currentSong && this.state.isPlaying ) ? this.state.currentSong.artist + ' - ' + this.state.currentSong.name : 'Weekly Vibes';

        var content = (!this.state.loadingAnimationPhase2Finished) ? (
            <div id="home-page">
                <Loading
                 ref={(c) => this._loadingComponent = c }
                 loadingAnimationPhase1Finished={() => this.setState({loadingAnimationPhase1Finished: true})}
                 beginAnimationPhase2={this.state.loadingAnimationPhase1Finished && !this.state.loading}
                 loadingAnimationPhase2Finished={() => this.setState({loadingAnimationPhase2Finished: true})} />
             </div>
        ) : (
            <div id="home-page">
                <VelocityTransitionGroup enter={{animation: {translateY: '0%'}, easing: defaultEasing, delay: verticalAnimationDelay}} leave={{animation: {translateY: '-100%'}}} runOnMount={true}>
                    <Header
                        playlistOpen={this.state.playlistOpen}
                        nowPlayingHit={this.nowPlayingHit.bind(this)}
                        playlistHit={this.playlistHit.bind(this)} />
                </VelocityTransitionGroup>

                <div id='center-content-wrapper' className={centerContentClass}>
                    <VelocityTransitionGroup
                        id='filter-bar'
                        enter={{animation: {translateX: '0%'}, easing: defaultEasing, delay: horizontalAnimationDelay}}
                        leave={{animation: {translateX: '-100%'}}}
                        runOnMount={true}
                        component="div">

                        <FilterBar />
                    </VelocityTransitionGroup>


                    <VelocityTransitionGroup
                        id='event-detail'
                        enter={{animation: {translateY: '0%'}, easing: defaultEasing}}
                        leave={{animation: {translateY: '100%'}}}
                        runOnMount={true}
                        component="div">

                        <EventDetail />
                    </VelocityTransitionGroup>

                    <VelocityTransitionGroup
                        id='event-playlist'
                        enter={{animation: {translateX: '0%'}, easing: defaultEasing, delay: horizontalAnimationDelay}}
                        leave={{animation: {translateX: '100%'}}}
                        runOnMount={true}
                        component="div">

                        <EventPlaylist eventSelected={this.eventSelected.bind(this)} />
                    </VelocityTransitionGroup>

                </div>
                <VelocityTransitionGroup enter={{animation: {translateY: '0%'}, easing: defaultEasing, delay: verticalAnimationDelay}} leave={{animation: {translateY: '100%'}}} duration={500} runOnMount={true}>
                    <Player />
                </VelocityTransitionGroup>
            </div>
        );

        return (
            <DocumentTitle title={documentTitle}>
                {content}
            </DocumentTitle>
        );
    }
}

export default HomePage;
