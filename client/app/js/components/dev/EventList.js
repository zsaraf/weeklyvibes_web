'use strict';

import React            from 'react';
import CenteredImage    from '../CenteredImage';
import moment           from 'moment-timezone';
import WVUtils          from '../../utils/WVUtils';
import DevActions       from '../../actions/DevActions';
import PlaybackActions  from '../../actions/PlaybackActions';
import Section          from '../reusable/Section';

class EventListNode extends React.Component {

    constructor(props) {
        super(props);
    }

    updateWVPopularity(e) {
        e.preventDefault();
        DevActions.updateWVPopularityForEvent(this.props.event, e.target.value);
        this._wvPopularityInput.value = '...';
    }

    keyDown(e) {
        if (e.keyCode == 13) {
            this._wvPopularityInput.blur();
        }

    }

    componentDidUpdate() {
        this._wvPopularityInput.value = this.props.event.wvPopularity;
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

        var extraClasses = '';

        if (this.props.isSelected) {
            extraClasses += 'selected';
        }

        return (
            <div className={'event-playlist-node ' + extraClasses}>
                <div className='left-content'>
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
                <div className='right-content'>
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
                    <div className='wv-popularity'>
                        <input ref={(c) => this._wvPopularityInput = c} type='text' onKeyDown={this.keyDown.bind(this)} defaultValue={this.props.event.wvPopularity} onBlur={this.updateWVPopularity.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}


class EventList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var count = 0;
        var eventNodes =  (this.props.events) ?
            this.props.events.map(function (e) {
                count++;

                return (
                    <EventListNode
                        event={e}
                        key={e.id}
                        isSelected={(this.props.currentEvent == e)}
                        ref={'eventListNode' + e.id}
                    />
                );
            }.bind(this))
        : null;

        return (
            <div className='event-list-wrapper'>
                <Section title='Events'>
                    {eventNodes}
                </Section>
            </div>
        );
    }

}

export default EventList;
