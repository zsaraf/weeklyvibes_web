'use strict';

import React            from 'react';
import CenteredImage    from './CenteredImage';
import PlayingIndicator from './PlayingIndicator';
import moment           from 'moment-timezone';
import WVUtils          from '../utils/WVUtils';
import PlaybackStore    from '../stores/PlaybackStore';
import EventStore       from '../stores/EventStore';
import EventActions     from '../actions/EventActions';
import ReactDOM         from 'react-dom';
import Section          from './reusable/Section';

class EventPlaylistNode extends React.Component {

    constructor(props) {
        super(props);
    }

    eventSelected(e) {
        e.preventDefault();
        EventActions.eventSelected(this.props.event);

        // Check if we are open right -- if so close it
        var eventPlaylistNode =  ReactDOM.findDOMNode(this).parentNode;
        if (eventPlaylistNode.classList.contains('open-right')) {
            console.log(eventPlaylistNode);
        }
    }

    render() {
        var forDate = moment.tz(this.props.event.startDt, this.props.event.venue.timezone).format('dddd');

        var playingIndicator = null;
        if (this.props.isPlaying) {
            playingIndicator = (
                <PlayingIndicator
                    isPlaying={this.props.isAudioPlaying}
                />
            );
        }

        return (
            <div className='event-playlist-node' onClick={this.eventSelected.bind(this)}>
                <div className='left-content'>
                    <div className='artist-img-wrapper'>
                        <CenteredImage
                            imgSrc={this.props.event.eventArtists[0].artist.imgSrc}
                            id={this.props.event.id}
                        />
                        <div className='playing-indicator-wrapper'>
                            {playingIndicator}
                        </div>
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

            eventPlaylistNodes = this.state.events.map(function (e) {

                var isPlaying = (this.state.eventPlaying && this.state.eventPlaying.id == e.id) ? true : false;

                return (
                    <EventPlaylistNode
                        event={e}
                        key={e.id}
                        isPlaying={isPlaying}
                        isAudioPlaying={this.state.audioPlaying}
                        ref={'eventPlaylistNode' + e.id}
                    />
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
