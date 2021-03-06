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
import Section          from './reusable/Section';
import SegmentedControl from './reusable/SegmentedControl';
import { Popover, Overlay } from 'react-bootstrap';
import Clipboard        from 'clipboard';

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
        this.state = {
            getTicketsPopoverOpen: false,
            copyLinkPopoverOpen: false
        };
    }

    componentDidMount() {
        // Add readmore
        var bioNode = this.refs.bio;
        bioNode.innerHTML = this.props.eventArtist.artist.bio;
        $(bioNode).readmore({
            moreLink: '<div style="text-align:center"><a href="#" class="read-more-link">Read More</a></div>',
            lessLink: '<div style="text-align:center"><a href="#" class="read-more-link">Read Less</a></div>'
        });

        // Add clipboard js for copy link buton
        new Clipboard('.event-detail-node-copy-link-button');
    }

    onTicketButtonClick(e) {
        e.preventDefault();
        if (!this.props.event.soldOut) {
            window.open(this.props.event.ticketUrl, '_blank');
        } else {
            this.setState({
                getTicketsPopoverOpen: !this.state.getTicketsPopoverOpen
            });
        }
    }

    onSpotifyLinkClick(e) {
        e.preventDefault();
        window.open(this.props.eventArtist.artist.spotifyUrl, '_blank');
    }

    onSCLinkClick(e) {
        e.preventDefault();
        window.open(this.props.eventArtist.artist.soundcloudUrl, '_blank');
    }

    onTicketButtonMouseEnter(e) {
        e.preventDefault();
        if (!this.props.event.soldOut) return;
        this.setState({
            getTicketsPopoverOpen: true
        });
    }

    onTicketButtonMouseLeave(e) {
        e.preventDefault();
        if (!this.props.event.soldOut) return;
        this.setState({
            getTicketsPopoverOpen: false
        });
    }

    onCopyLinkButtonClick(e) {
        setTimeout(() => {
            this.setState({
                copyLinkPopoverOpen: true
            });
        }, 100);

        setTimeout(() => {
            this.setState({
                copyLinkPopoverOpen: false
            });
        }, 800);
    }

    onPopoverWantsHide(e) {
        this.setState({
            getTicketsPopoverOpen: false,
            copyLinkPopoverOpen: false
        });
    }

    // Component helpers

    eventShareDiv() {
        // Only add share component when is primary
        if (!this.props.primary) {
            return null;
        }

        // Get twitter intents
        const wvHashtag = encodeURIComponent('weeklyvibes');
        const wvHref = encodeURIComponent(WVUtils.shareUrlForEvent(this.props.event));
        const tweetIntent = `https://twitter.com/intent/tweet?url=${wvHref}&hashtags=${wvHashtag}`;

        // Get ticket text based on whether available or not
        const ticketText = this.props.event.soldOut == 0 ? 'Tickets' : 'Unavailable';

        // Get buttons
        const getTicketButton = (
            <button className='event-detail-node-get-tickets-button'
                    onMouseEnter={this.onTicketButtonMouseEnter.bind(this)}
                    onMouseLeave={this.onTicketButtonMouseLeave.bind(this)}
                    onClick={this.onTicketButtonClick.bind(this)}
                    ref={(c) => this._getTicketButton = c }>
                {ticketText}
            </button>
        );

        const copyLinkButton = (
            <button className='event-detail-node-copy-link-button'
                    onClick={this.onCopyLinkButtonClick.bind(this)}
                    ref={(c) => this._copyLinkButton = c }
                    data-clipboard-text={WVUtils.shareUrlForEvent(this.props.event)}>
                Copy Link
            </button>
        );

        const facebookShareButton = (
            <button className='facebook-share-button event-detail-node-share-button'
                    onClick={() => this.props.shareFacebook(this)} />
        );

        const twitterShareButton = (
            <a href={tweetIntent}
               className='twitter-share-button event-detail-node-share-button'
               onClick={ () => this.props.shareTwitter(this)} />
        );

        const scButton = (this.props.eventArtist.artist.soundcloudUrl) ? (
            <button className='sc-link-button event-detail-node-share-button'
                    onClick={this.onSCLinkClick.bind(this)} />
        ) : null;

        const spotifyButton = (this.props.eventArtist.artist.spotifyUrl) ? (
            <button className='spotify-link-button event-detail-node-share-button'
                    onClick={this.onSpotifyLinkClick.bind(this)} />
        ) : null;

        return (
            <div className='event-detail-node-share'>
                {getTicketButton}
                {copyLinkButton}
                {facebookShareButton}
                {twitterShareButton}
                {scButton}
                {spotifyButton}
            </div>
        );
    }

    eventInfoDiv() {
        // Only add event info when is primary node
        if (!this.props.primary) {
            return null;
        }

        // Get start time for day/time string
        var startTime = moment.tz(this.props.event.startDt, this.props.event.venue.timezone);
        var dayString = startTime.format('dddd, MMMM Do');
        var timeString = startTime.format('h:mm a');

        return (
            <div className='event-detail-node-event-info'>
                <div>
                    {this.props.event.venue.name}
                </div>
                <div>
                    {dayString} &middot; {timeString}
                </div>

            </div>
        );
    }

    // Popover helpers

    getTicketsPopover() {
        return (
            <Overlay
                show={this.state.getTicketsPopoverOpen}
                target={() => {
                    // Need to do this b/c we recycle eventshare
                    return $('.event-detail-node-get-tickets-button:visible')[0];
                } }
                placement='bottom'
                rootClose={true}
                container={this}
                onHide={this.onPopoverWantsHide.bind(this)}
                containerPadding={12}>

                <Popover id='ticket-popover' className='wv-popover' title={'WE\'RE SORRY'}>
                    We can&rsquo;t seem to find any tickets for this event!
                </Popover>
            </Overlay>
        );
    }

    copyLinkPopover() {
        return (
            <Overlay
                show={this.state.copyLinkPopoverOpen}
                target={() => {
                    // Need to do this b/c we recycle eventshare
                    return $('.event-detail-node-copy-link-button:visible')[0];
                }.bind(this) }
                placement='bottom'
                rootClose={true}
                container={this}
                onHide={this.onPopoverWantsHide.bind(this)}
                containerPadding={12}>

                <Popover id='copy-link-popover' className='wv-popover' title={'DOPE...'}>
                    Link copied!
                </Popover>
            </Overlay>
        );
    }

    eventArtistInfoDiv() {
        const scButton = (this.props.eventArtist.artist.soundcloudUrl) ? (
            <button className='sc-link-button event-detail-node-eventartist-link-button show-for-secondary'
                    onClick={this.onSCLinkClick.bind(this)} />
        ) : null;

        const spotifyButton = (this.props.eventArtist.artist.spotifyUrl) ? (
            <button className='spotify-link-button event-detail-node-eventartist-link-button show-for-secondary'
                    onClick={this.onSpotifyLinkClick.bind(this)} />
        ) : null;

        return (
            <div className='event-detail-node-artist-info'>
                <div className='event-detail-node-artist-name'>
                    {this.props.eventArtist.artist.name}
                </div>
                {scButton}
                {spotifyButton}
            </div>
        );
    }

    render() {
        const cls = this.props.primary == true ? 'primary' : 'secondary';

        // Get divs
        const eventInfo = this.eventInfoDiv();
        const eventArtistInfo = this.eventArtistInfoDiv();
        const eventShare = this.eventShareDiv();

        // Get popovers
        const getTicketsPopover = this.getTicketsPopover();
        const copyLinkPopover = this.copyLinkPopover();

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
                            {eventArtistInfo}
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
                {getTicketsPopover}
                {copyLinkPopover}
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

    onEventStoreChanged(
        err,
        currentEvent,
        filteredEvents,
        filteredVenues,
        filteredDays,
        currentEventArtist,
        scrollToArtist
    ) {
        if (err) {
            console.log(err);
        } else {
            this.setState({
                masterEvent: currentEvent,
                currentEvent: currentEvent,
                selectedIndex: 0
            });

            if (scrollToArtist) {
                var thisAsNode = ReactDOM.findDOMNode(this).parentNode;
                if (currentEventArtist) {
                    var eaNode = ReactDOM.findDOMNode(this.refs[currentEventArtist.id]);
                    thisAsNode.scrollTop = eaNode.offsetTop;
                } else {
                    thisAsNode.scrollTop = 0;
                }
            }
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
                    ref={ea.id}
                    currentSong={this.state.currentSong}
                    isPlaying={this.state.isPlaying}
                    shareFacebook={this.shareFacebook.bind(this)}
                    shareTwitter={this.shareTwitter.bind(this)}
                    copyShareLink={this.copyShareLink.bind(this)}/>
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
            <div id='event-detail-content'>
                {segmentedControl}
                {eventDetailNodes}
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

    copyShareLink(event) {
        console.log(event);
        console.log('Copy share link');
    }

}

export default EventDetail;
