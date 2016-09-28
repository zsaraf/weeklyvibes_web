'use strict';

import React            from 'react';
import CenteredImage    from './CenteredImage';
import PlayingIndicator from './PlayingIndicator';
import moment           from 'moment-timezone';
import WVUtils          from '../utils/WVUtils';
import PlaybackStore    from '../stores/PlaybackStore';
import EventStore       from '../stores/EventStore';
import EventActions     from '../actions/EventActions';
import PlaybackActions  from '../actions/PlaybackActions';
import ReactDOM         from 'react-dom';
import Section          from './reusable/Section';

class EventPlaylistNode extends React.Component {

    constructor(props) {
        super(props);
    }

    eventSelected(e) {
        e.preventDefault();
        this.props.eventSelected(this.props.event);
    }

    playSelected(e) {
        e.preventDefault();
        EventActions.eventSelected(this.props.event);

        if (this.props.isPlaying) {
            e.stopPropagation();
            if (this.props.isAudioPlaying) {
                PlaybackActions.pause();
            } else {
                PlaybackActions.play();
            }
        } else {
            PlaybackActions.playSong(this.props.event.eventArtists[0].artist.songs[0]);
        }
    }

    render() {
        var forDate = '';
        if (this.props.event.duplicateEvents) {
            var total = this.props.event.duplicateEvents.length;
            forDate += WVUtils.getDayStringForEvent(this.props.event);
            for (var i = 0; i < total; i++) {
                var e = this.props.event.duplicateEvents[i];
                var separator = ', ';
                if (i >= total - 1) {
                    separator = ' & ';
                }

                forDate += separator + WVUtils.getDayStringForEvent(e);
            }
        } else {
            forDate = moment.tz(this.props.event.startDt, this.props.event.venue.timezone).format('dddd, MMMM Do');
        }

        var playingIndicator = null;
        var extraClasses = '';
        if (this.props.isPlaying && this.props.isAudioPlaying) {
            extraClasses += 'playing ';
        }

        if (this.props.isSelected) {
            extraClasses += 'selected';
        }

        return (
            <div className={'event-playlist-node ' + extraClasses}>
                <div className='left-content' onClick={this.playSelected.bind(this)}>
                    <div className='artist-img-wrapper'>
                        <CenteredImage
                            imgSrc={this.props.event.eventArtists[0].artist.imgSrc}
                            id={this.props.event.id}
                        />
                        <div className='playing-icon-wrapper'>
                            <div className='playing-icon'></div>
                        </div>
                    </div>
                </div>
                <div className='right-content' onClick={this.eventSelected.bind(this)}>
                    <div className='right-content-wrapper'>
                        <div className='right-content-item'>
                            {this.props.event.eventArtists[0].artist.name}
                        </div>
                        <div className='right-content-item'>
                            {forDate}
                        </div>
                        <div className='right-content-item'>
                            {this.props.event.venue.name}
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

        var currentEvent = EventStore.currentEvent;
        var events = EventStore.filteredEvents;

        var eventPlaying = (PlaybackStore.currentSong) ? WVUtils.findEventWithSongId(PlaybackStore.currentSong.id, events) : null;
        var audioPlaying = PlaybackStore.isPlaying;
        this.state = {
            currentEvent: currentEvent,
            events: events,
            eventPlaying: eventPlaying,
            audioPlaying: audioPlaying
        };
    }

    onEventStoreChanged(err, currentEvent, filteredEvents, filteredVenues, filteredDays, selectionStatus) {
        if (err) {
            console.log(err);
        } else {
            this.setState({
                currentEvent: currentEvent,
                events: filteredEvents
            });
        }
    }

    playbackChanged(err, currentSong, isPlaying) {
        var eventPlaying = WVUtils.findEventWithSongId(currentSong.id, EventStore.events);
        this.setState({
            eventPlaying: eventPlaying,
            audioPlaying: isPlaying
        });
    }

    componentDidMount() {
        this.unsubscribe = PlaybackStore.listen(this.playbackChanged.bind(this));
        this.unsubscribeEvents = EventStore.listen(this.onEventStoreChanged.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribeEvents();
    }

    render() {
        var eventPlaylistNodes = null;
        var emptyState = null;
        var emptyClass = '';
        if (this.state.events) {
            var count = 0;
            eventPlaylistNodes = this.state.events.map(function (e) {
                var isPlaying = (this.state.eventPlaying && this.state.eventPlaying.id == e.id) ? true : false;
                var isSelected = (this.state.currentEvent == e);

                count++;
                var divider = (count < this.state.events.length) ? (
                    <div className='event-playlist-node-divider' />
                ) : null;

                return (
                    <div className='event-playlist-node-wrapper' key={e.id}>
                        <EventPlaylistNode
                            event={e}
                            eventSelected={this.props.eventSelected}
                            isPlaying={isPlaying}
                            isSelected={isSelected}
                            isAudioPlaying={this.state.audioPlaying}
                            ref={'eventPlaylistNode' + e.id}
                        />
                        {divider}
                    </div>

                );
            }.bind(this));

            if (this.state.events.length == 0) {
                emptyState = (
                    <div className='empty-event-playlist'>
                        <div className='events-nil-wrapper'>
                            <img className='events-nil' src='../images/events-nil.svg'/>
                        </div>
                        <div className='text'>
                            Yoo!! Select some venues to keep the good vibes rollin&rsquo;
                        </div>
                    </div>
                );
                emptyClass = 'empty';
            }
        }

        return (
            <div id='event-playlist'>
                <Section title='Events' classes={emptyClass}>
                    {emptyState}
                    {eventPlaylistNodes}
                </Section>
            </div>
        );
    }

}

export default EventPlaylist;
