'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment-timezone';
import CenteredImage from './CenteredImage';
import $ from 'jquery';
import readmore from 'readmore-js';

class EventDetailNodeSongListItem extends React.Component {

    render() {

        var number  = this.props.position + 1 + '.';
        return (
            <tr className='event-detail-node-song-list-item'>
                <td>
                    <div className='position'>
                        {number}
                    </div>
                </td>
                <td>
                    <div className='song-name'>
                        {this.props.song.name}
                    </div>
                </td>
                <td>
                    <div className="music-playing">
                        <div className="bar bar1" style={{ height: '15%' }}></div>
                        <div className="bar bar2" style={{ height: '75%' }}></div>
                        <div className="bar bar3" style={{ height: '25%' }}></div>
                        <div className="bar bar4" style={{ height: '90%' }}></div>
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
            return (
                <EventDetailNodeSongListItem
                    song={song}
                    key={song.id}
                    position={count}
                />
            );

        });

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
            lessLink: '<a href="#">Read Less</a>'
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

            eventShare =    (<div className='event-detail-node-share'>
                                <button className='event-detail-node-share-button facebook-share-button'/>
                                <button className='event-detail-node-share-button twitter-share-button'/>
                                <button className='event-detail-node-get-tickets-button'>Tickets</button>
                            </div>);
        }

        return (
            <div className={'event-detail-node ' + cls}>
                <div className="event-detail-node-top">
                    <div className='artist-img-wrapper'>
                        <CenteredImage
                            imgSrc={this.props.eventArtist.artist.imgSrc}
                            id={this.props.eventArtist.id}
                        />
                    </div>
                    <div className='event-detail-node-top-right-section'>
                        <div className='event-detail-node-artist-name'>
                            {this.props.eventArtist.artist.name + ' (' + this.props.eventArtist.billing + ')'}
                        </div>
                        {eventInfo}
                        {eventShare}
                    </div>
                </div>
                <div className="event-detail-node-bottom">
                    <EventDetailNodeSongList
                        songs={this.props.eventArtist.artist.songs}
                    />
                    <h3>BIO</h3>
                    <div className="event-detail-node-bio" ref="bio">
                    </div>
                </div>
            </div>
        );
    }
}

class EventDetail extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        var eventDetailNodes = null;
        var centeredImage = null;
        if (this.props.currentEvent) {
            eventDetailNodes = this.props.currentEvent.eventArtists.map(function (ea, i) {
                return (
                    <EventDetailNode
                        event={this.props.currentEvent}
                        eventArtist={ea}
                        primary={i == 0}
                        key={ea.id}
                    />
                );
            }, this);

            centeredImage = (
                <CenteredImage
                    imgSrc={this.props.currentEvent.eventArtists[0].artist.imgSrc}
                    id={this.props.currentEvent.id}
                />
            );
        }

        return (
            <div id='event-detail' className="mobile-shift">
                <div id='event-detail-background-image-wrapper'>
                    {centeredImage}
                </div>
                <div id='event-detail-content'>
                    {eventDetailNodes}
                </div>
            </div>
        );
    }

}

export default EventDetail;
