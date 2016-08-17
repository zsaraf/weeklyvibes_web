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
        EventActions.eventSelected(this.props.event);
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
        var forDate = moment.tz(this.props.event.startDt, this.props.event.venue.timezone).format('dddd, MMMM Do');

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

        this.state = {
            currentEvent: null,
            events: null,
            eventPlaying: null,
            audioPlaying: false
        };
    }

    onEventStoreChanged(err, currentEvent, filteredEvents, filteredVenues, filteredDays) {
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
        var eventPlaying = WVUtils.findEventWithSongId(currentSong.id, this.state.events);
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
                            isPlaying={isPlaying}
                            isSelected={isSelected}
                            isAudioPlaying={this.state.audioPlaying}
                            ref={'eventPlaylistNode' + e.id}
                        />
                        {divider}
                    </div>

                );
            }.bind(this));
        }

        return (
            <div id='event-playlist' className='mobile-shift'>
                <Section title='Events'>
                    {eventPlaylistNodes}
                </Section>
            </div>
        );
    }

}

export default EventPlaylist;
