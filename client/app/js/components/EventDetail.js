'use strict';

import React            from 'react';
import ReactDOM         from 'react-dom';
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

class EventDetailNodeSongListItem extends React.Component {

    songListItemHit() {
        PlaybackActions.playSong(this.props.song);
    }

    render() {

        var number  = this.props.position + 1 + '.';
        var playingIndicator = null;
        if (this.props.selected) {
            playingIndicator = (
                <div id='playing-indicator-wrapper'>
                    <PlayingIndicator
                        isPlaying={this.props.isPlaying}
                    />
                </div>
            );
        }

        return (
            <tr className='event-detail-node-song-list-item' onClick={this.songListItemHit.bind(this)}>
                <td>
                    <div className='contain'>
                        <div className='position'>
                            {number}
                        </div>
                        <div className='song-name'>
                            <div className='text'>{this.props.song.name}</div>
                        </div>
                        {playingIndicator}
                    </div>
                </td>
            </tr>
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
            <table className='event-detail-node-song-list'>
                <tbody>
                    {nodes}
                </tbody>
            </table>
        );
    }
}

class EventDetailNode extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var bioNode = ReactDOM.findDOMNode(this.refs.bio);
        bioNode.innerHTML = this.props.eventArtist.artist.bio;
        $(bioNode).readmore({
            lessLink: '<a href="#"">Read Less</a>'
        });
    }

    render() {
        var startTime = moment.tz(this.props.event.startDt, this.props.event.venue.timezone);
        var dayString = startTime.format('dddd');
        var timeString = startTime.format('h:mm a');

        var cls = this.props.primary == true ? 'primary' : 'secondary';
        var eventInfo = null;
        var eventShare = null;
        if (this.props.primary == true) {
            eventInfo = (<div className='event-detail-node-event-info'>
                            {this.props.event.venue.name} &middot; {dayString} &middot; {timeString}
                        </div>);

            var wvHashtag = encodeURIComponent('weeklyvibes');
            var wvHref = encodeURIComponent(WVUtils.shareUrlForEvent(this.props.event.id));
            var tweetIntent = `https://twitter.com/intent/tweet?url=${wvHref}&hashtags=${wvHashtag}`;
            var ticketText = this.props.event.soldOut == 0 ? 'Tickets' : 'Sold Out';
            eventShare =    (<div className='event-detail-node-share'>
                                <button className='event-detail-node-share-button facebook-share-button' onClick={() => this.props.shareFacebook(this)}/>
                                <a href={tweetIntent} className='event-detail-node-share-button twitter-share-button' onClick={ () => this.props.shareTwitter(this)}/>
                                <button className='event-detail-node-get-tickets-button' onClick={() => window.open(this.props.event.ticketUrl, '_blank')} >{ticketText}</button>
                            </div>);
        }

        return (
            <div className={'event-detail-node ' + cls}>
                <div className='event-detail-node-top'>
                    <div className='artist-img-wrapper'>
                        <CenteredImage
                            imgSrc={this.props.eventArtist.artist.imgSrc}
                            id={this.props.eventArtist.id}
                        />
                    </div>
                    <div className='event-detail-node-top-right-section'>
                        <div className='event-detail-node-artist-name'>
                            {this.props.eventArtist.artist.name}
                        </div>
                        {eventInfo}
                        {eventShare}
                    </div>
                </div>
                <div className='event-detail-node-bottom'>
                    <EventDetailNodeSongList
                        songs={this.props.eventArtist.artist.songs}
                        currentSong={this.props.currentSong}
                        isPlaying={this.props.isPlaying}
                    />
                    <h3>BIO</h3>
                    <div className='event-detail-node-bio' ref='bio'>
                    </div>
                </div>
            </div>
        );
    }
}

class EventDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            currentSong: null,
            isPlaying: false,
            currentEvent: null
        };
    }

    playbackChanged(err, currentSong, isPlaying) {
        this.setState({
            currentSong: currentSong,
            isPlaying: isPlaying
        });
    }

    onEventStoreChanged(err, currentEvent, filteredEvents, filteredVenues, filteredDays) {
        if (err) {
            console.log(err);
        } else {
            this.setState({
                currentEvent: currentEvent,
            });
        }
    }

    componentDidMount() {
        this.unsubscribe = PlaybackStore.listen(this.playbackChanged.bind(this));
        this.unsubscribeEvents = EventStore.listen(this.onEventStoreChanged.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        var eventDetailNodes = null;
        var centeredImage = null;

        if (this.state.currentEvent) {

            eventDetailNodes = this.state.currentEvent.eventArtists.map(function (ea, i) {
                return (
                    <EventDetailNode
                        event={this.state.currentEvent}
                        eventArtist={ea}
                        primary={i == 0}
                        key={ea.id}
                        currentSong={this.state.currentSong}
                        isPlaying={this.state.isPlaying}
                        shareFacebook={this.shareFacebook.bind(this)}
                        shareTwitter={this.shareTwitter.bind(this)}
                    />
                );
            }, this);

            centeredImage = (
                <CenteredImage
                    imgSrc={this.state.currentEvent.eventArtists[0].artist.imgSrc}
                    id={this.state.currentEvent.id}
                    watchForResize={true}
                />
            );
        }

        return (
            <div id='event-detail' className='mobile-shift'>
                <div id='event-detail-content'>
                    {eventDetailNodes}
                </div>
                <div id='event-detail-background-image-wrapper'>
                    {centeredImage}
                </div>
            </div>
        );
    }

    shareFacebook() {
        console.log('share fb');
        console.log(this.props);
        var href = WVUtils.shareUrlForEvent(this.state.currentEvent.id);
        FB.ui({ method: 'share', href: href, hashtag: '#weeklyvibes'}, function(response) {

        });
    }

    shareTwitter() {
        console.log('share twitter');
    }

}

export default EventDetail;
