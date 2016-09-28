'use strict';

import React            from 'react';
import moment           from 'moment-timezone';
import CenteredImage    from './CenteredImage';
import $                from 'jquery';
import readmore         from 'readmore-js';
import PlaybackStore    from '../stores/PlaybackStore';
import PlaybackActions  from '../actions/PlaybackActions';
import WVUtils          from '../utils/WVUtils';
import EventActions     from '../actions/EventActions';
import EventStore       from '../stores/EventStore';
import PlayingIndicator from './PlayingIndicator';
import Section          from './reusable/Section';
import SegmentedControl from './reusable/SegmentedControl';

class EventDetailNodeSongListItem extends React.Component {

    songListItemHit() {
        if (this.props.selected) {
            if (this.props.isPlaying) {
                PlaybackActions.pause();
            } else {
                PlaybackActions.play();
            }
        } else {
            PlaybackActions.playSong(this.props.song);
        }
    }

    render() {

        var number  = this.props.position + 1;
        var playingIndicator = null;
        var extraClasses = '';
        var positionIcon = null;
        if (this.props.selected) {
            extraClasses = 'selected' + ((this.props.isPlaying) ? ' playing' : '');
        }

        return (
            <div className={'event-detail-node-song-list-item ' + extraClasses} onClick={this.songListItemHit.bind(this)}>
                <div className='contain'>
                    <div className='position-wrapper'>
                        <div className='position'>{number}</div>
                        <div className="position-icon"></div>
                    </div>
                    <div className='song-name'>
                        <div className='text'>{this.props.song.name}</div>
                    </div>
                    {playingIndicator}
                </div>
            </div>
        );
    }
}

class EventDetailNodeSongList extends React.Component {

    render() {

        var count = -1;
        var nodes = this.props.songs.map(function (song) {
            count++;

            var selected = (this.props.currentSong && this.props.currentSong.id == song.id);

            return (
                <EventDetailNodeSongListItem
                    song={song}
                    key={song.id}
                    position={count}
                    selected={selected}
                    isPlaying={this.props.isPlaying}
                />
            );

        }, this);

        return (
            <div className='event-detail-node-song-list'>
                {nodes}
            </div>
        );
    }
}

class EventDetailNode extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var bioNode = this.refs.bio;
        bioNode.innerHTML = this.props.eventArtist.artist.bio;
        $(bioNode).readmore({
            moreLink: '<div style="text-align:center"><a href="#" class="read-more-link">Read More</a></div>',
            lessLink: '<div style="text-align:center"><a href="#" class="read-more-link">Read Less</a></div>'
        });
    }

    render() {
        var startTime = moment.tz(this.props.event.startDt, this.props.event.venue.timezone);
        var dayString = startTime.format('dddd, MMMM Do');
        var timeString = startTime.format('h:mm a');

        var cls = this.props.primary == true ? 'primary' : 'secondary';
        var eventInfo = null;
        var eventShare = null;
        if (this.props.primary == true) {
            eventInfo = (
                <div className='event-detail-node-event-info'>
                    <div>
                        {this.props.event.venue.name}
                    </div>
                    <div>
                        {dayString} &middot; {timeString}
                    </div>

                </div>
            );

            var wvHashtag = encodeURIComponent('weeklyvibes');
            var wvHref = encodeURIComponent(WVUtils.shareUrlForEvent(this.props.event));
            var tweetIntent = `https://twitter.com/intent/tweet?url=${wvHref}&hashtags=${wvHashtag}`;
            var ticketText = this.props.event.soldOut == 0 ? 'Tickets' : 'Unavailable';
            eventShare = (
                <div className='event-detail-node-share'>
                    <button className='event-detail-node-get-tickets-button' onClick={() => window.open(this.props.event.ticketUrl, '_blank')} >{ticketText}</button>
                    <button className='facebook-share-button event-detail-node-share-button' onClick={() => this.props.shareFacebook(this)}/>
                    <a href={tweetIntent} className='twitter-share-button event-detail-node-share-button' onClick={ () => this.props.shareTwitter(this)}/>
                </div>
            );
        }

        return (
            <Section title={(this.props.primary) ? 'Headliner' : 'Supporter'}>
                <div className={'event-detail-node ' + cls}>
                    <div className='event-detail-node-top'>
                        <div className='artist-img-wrapper'>
                            <CenteredImage
                                imgSrc={this.props.eventArtist.artist.imgSrc}
                                id={this.props.eventArtist.id}
                                watchForResize={this.props.primary ? true : false}
                            />
                        </div>
                        <div className='event-detail-node-top-right-section'>
                            <div className='event-detail-node-artist-name'>
                                {this.props.eventArtist.artist.name}
                            </div>
                            {eventInfo}
                            <div className="show-for-large">
                                {eventShare}
                            </div>
                        </div>
                    </div>
                    <div className="hide-for-large">
                        {eventShare}
                    </div>
                    <div className='event-detail-node-bottom'>
                        <EventDetailNodeSongList
                            songs={this.props.eventArtist.artist.songs}
                            currentSong={this.props.currentSong}
                            isPlaying={this.props.isPlaying}
                        />
                        <div className='event-detail-node-bio' ref='bio'>
                        </div>
                    </div>
                </div>
            </Section>
        );
    }
}

class EventDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            currentSong: PlaybackStore.currentSong,
            isPlaying: PlaybackStore.isPlaying,
            masterEvent: EventStore.currentEvent,
            currentEvent: EventStore.currentEvent,
            selectedIndex: 0
        };
    }

    playbackChanged(err, currentSong, isPlaying) {
        this.setState({
            currentSong: currentSong,
            isPlaying: isPlaying
        });
    }

    onEventStoreChanged(err, currentEvent, filteredEvents, filteredVenues, filteredDays, selectionStatus) {
        if (err) {
            console.log(err);
        } else {
            this._eventDetailContent.scrollTop = 0;
            this.setState({
                masterEvent: currentEvent,
                currentEvent: currentEvent,
                selectedIndex: 0
            });
        }
    }

    indexSelected(index) {
        var eventToDisplay = (index == 0) ? this.state.masterEvent : this.state.masterEvent.duplicateEvents[index - 1];
        this.setState({
            currentEvent: eventToDisplay,
            selectedIndex: index
        });
        EventActions.updateBrowserHistoryWithEvent(eventToDisplay);
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
        var eventDetailNodes = (this.state.currentEvent) ? this.state.currentEvent.eventArtists.map(function (ea, i) {
            return (
                <EventDetailNode
                    event={this.state.currentEvent}
                    eventArtist={ea}
                    primary={i == 0}
                    key={ea.id}
                    currentSong={this.state.currentSong}
                    isPlaying={this.state.isPlaying}
                    shareFacebook={this.shareFacebook.bind(this)}
                    shareTwitter={this.shareTwitter.bind(this)} />
            );
        }, this) : null;

        var segmentedControl = null;
        if (this.state.masterEvent && this.state.masterEvent.duplicateEvents) {
            var titles = [];
            titles.push(WVUtils.getDayStringForEvent(this.state.masterEvent));
            titles.push.apply(titles, this.state.masterEvent.duplicateEvents.map(function (duplicateEvent) {
                return WVUtils.getDayStringForEvent(duplicateEvent);
            }));

            segmentedControl = (
                <SegmentedControl
                    indexSelected={this.indexSelected.bind(this)}
                    selectedIndex={this.state.selectedIndex}
                    titles={titles} />
            );
        }

        return (
            <div id='event-detail'>
                <div id='event-detail-content' ref={(c) => this._eventDetailContent = c}>
                    {segmentedControl}
                    {eventDetailNodes}
                </div>
            </div>
        );
    }

    shareFacebook() {
        var href = WVUtils.shareUrlForEvent(this.state.currentEvent);
        FB.ui({ method: 'share', href: href, hashtag: '#weeklyvibes' }, function (response) {

        });
    }

    shareTwitter() {
        console.log('share twitter');
    }

}

export default EventDetail;
