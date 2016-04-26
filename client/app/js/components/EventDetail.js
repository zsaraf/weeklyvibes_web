'use strict';

import React from 'react';

class EventDetailPrimaryNode extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className='event-detail-primary-node'>
                <img src={this.props.eventArtist.artist.imgSrc} className="artist-image" />
                <div className='event-detail-primary-node-top-right-section'>
                    <div className='event-detail-primary-node-artist-name'>
                        {this.props.eventArtist.artist.name + ' (' + this.props.eventArtist.billing + ')'}
                    </div>
                    <div className='event-detail-primary-node-event-info'>
                        {this.props.event.venue.name} &middot; {this.props.event.startDt} &middot; {this.props.event.startDt}
                    </div>
                    <div className='event-detail-primary-node-share'>
                        <button className='event-detail-primary-node-share-button facebook-share-button'/>
                        <button className='event-detail-primary-node-share-button twitter-share-button'/>
                        <button className='get-tickets-button'>Get Tickets</button>
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

        //   console.log();
        //   eventDetailNode = <EventDetailPrimaryNode event={this.props.currentEvent} eventArtist={this.props.currentEvent.eventArtists[0]} key={this.props.currentEvent.id} />;
          // eventPlaylistNodes = this.props.filteredEvents.map(function (e) {
          //     return (
          //         <EventPlaylistNode
          //             event={e}
          //             key={e.id}
          //         />
          //     );
          // });
      }

      return (
          <div id='event-detail' className="mobile-shift">
              {eventDetailNodes}
          </div>
      );
    }

}

export default EventDetail;
