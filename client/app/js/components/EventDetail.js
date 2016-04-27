'use strict';

import React from 'react';
import moment from 'moment-timezone';
import CenteredImage from './CenteredImage';
import $ from 'jquery';

class EventDetailPrimaryNode extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        var startTime = moment.tz(this.props.event.startDt, this.props.event.venue.timezone)
        var dayString = startTime.format('dddd');
        var timeString = startTime.format('h:mm a');

        return (
            <div className='event-detail-primary-node'>
                <div className="event-detail-primary-node-top">
                    <div className='artist-img-wrapper'>
                        <CenteredImage
                            imgSrc={this.props.eventArtist.artist.imgSrc}
                            id={this.props.eventArtist.id}
                        />
                    </div>
                    <div className='event-detail-primary-node-top-right-section'>
                        <div className='event-detail-primary-node-artist-name'>
                            {this.props.eventArtist.artist.name + ' (' + this.props.eventArtist.billing + ')'}
                        </div>
                        <div className='event-detail-primary-node-event-info'>
                            {this.props.event.venue.name} &middot; {dayString} &middot; {timeString}
                        </div>
                        <div className='event-detail-primary-node-share'>
                            <button className='event-detail-primary-node-share-button facebook-share-button'/>
                            <button className='event-detail-primary-node-share-button twitter-share-button'/>
                            <button className='event-detail-primary-node-get-tickets-button'>Tickets</button>
                        </div>
                    </div>
                </div>
                <div className="event-detail-primary-node-bottom">
                    <h3>BIO</h3>
                    <div className="event-detail-primary-node-bio">
                        {this.props.eventArtist.artist.bio}
                    </div>
                </div>
            </div>
        );
    }
}

class EventDetailSecondaryNode extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className='event-detail-secondary-node'>
                <div className='name'>
                    {this.props.eventArtist.artist.name}
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
          var counter = 0;
          eventDetailNodes = this.props.currentEvent.eventArtists.map(function (ea) {
              counter += 1;
              if (counter == 1) {
                  return (
                      <EventDetailPrimaryNode
                            event={this.props.currentEvent}
                            eventArtist={ea}
                            key={ea.id}
                      />
                  );
              } else {
                  return (
                      <EventDetailSecondaryNode
                            event={this.props.currentEvent}
                            eventArtist={ea}
                            key={ea.id}
                      />
                  );
              }
          }, this);

          centeredImage = <CenteredImage
              imgSrc={this.props.currentEvent.eventArtists[0].artist.imgSrc}
              id={this.props.currentEvent.id}
          />;
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
