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

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            events: null,
            venues: null,
            filteredVenues: null,
            filteredEvents: null,
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
                events: events,
                venues: venues,
                filteredVenues: venues,
                filteredEvents: events,
                currentEvent: events.length > 1 ? events[0] : null,
                songQueue: songQueue,
                currentSong: songQueue.getCurrentSong(),
                positionInSongQueue: 0
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.date != this.props.params.date) {
            $('.date-picker').removeClass('animated slideInRight');
            $('.date-picker').addClass('animated slideOutRight');

            $('#player-blur-container').css('opacity', 0);

            $('#bickgroundimage-container').fadeTo(1000, 0.0, function () {
                this.setState({ loading: true, dayMix: null });
                var loading = $('div.loading');
                loading.css('opacity', '0');
                loading.fadeTo(1000, 1.0, function () {
                    loading.css('opacity', '');
                    loading.css('animation', '');
                    MixActions.getDayMix(nextProps.params.date ? nextProps.params.date : null);
                }.bind(this));

            }.bind(this));

            $('#player').fadeTo(1000, 0.0, function () {});
        }
    }

    imageLoaded() {
        var loading = $('div.loading');
        loading.css('animation', 'none');
        loading.css('opacity', 1);
        loading.fadeTo(1000, 0.0, function () {
            this.setState({
                loading: false,
                dayMix: this.state.dayMix
            });

            $('#bickgroundimage-container').fadeTo(1000, 1.0, function () {
                $('#player-blur-container').fadeTo(500, 1.0, function () {
                    $('.date-picker').show();
                    $('.date-picker').removeClass('animated slideOutRight');
                    $('.date-picker').addClass('animated slideInRight');
                });
            });

            $('#player').fadeTo(1000, 1.0, function () {});
        }.bind(this));
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

        // this.state.songQueue.debugPrintSongQueue();

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
                        venues={this.state.venues}
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
