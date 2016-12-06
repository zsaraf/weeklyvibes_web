'use strict';

import React            from 'react';
import FilterToggle     from './FilterToggle';
import EventStore       from '../stores/EventStore';
import EventActions     from '../actions/EventActions';
import Section          from './reusable/Section';
import Color            from 'color';
import ReactDOM         from 'react-dom';

class FilterBar extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            filteredVenues: EventStore.filteredVenues,
            filteredDays: EventStore.filteredDays
        };
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
                filteredVenues: filteredVenues,
                filteredDays: filteredDays,
            });
            this.colorVenues()
        }
    }

    componentDidMount() {
        this.unsubscribeEvents = EventStore.listen(this.onEventStoreChanged.bind(this))
        this.colorVenues()
    }

    getDayDivs() {
        var allDays = EventStore.days;
        return allDays.map(function (day, i) {
            return (
                <FilterToggle
                    text={day}
                    key={i}
                    selected={this.state.filteredDays.indexOf(day) != -1}
                    classes={'day'}
                    clickHandler={(toggle) => EventActions.dayFilterSelected(day)}
                />
            );
        }, this);
    }

    venueFilterSelected(venue) {
        EventActions.venueFilterSelected(venue)
    }

    colorVenues() {
        var venues = EventStore.venues

        var startHue = 265
        var saturation = 60
        var value = 91
        var endHue = 286
        var currentHue = startHue
        var step = (endHue - startHue) / venues.length

        for (var v of venues) {
            var cNode = ReactDOM.findDOMNode(this.refs['v' + v.id])
            if (cNode.classList.contains('selected')) {
                var color = Color().hsv(currentHue, saturation, value)
                cNode.style['background-color'] = color.hexString()
            } else {
                cNode.style['background-color'] = ''
            }
            currentHue += step;
        }

    }

    getVenueDivs() {
        var allVenues = EventStore.venues;
        return allVenues.map(function (venue) {
            return (
                <FilterToggle
                    text={venue.name}
                    key={venue.id}
                    selected={this.state.filteredVenues.indexOf(venue) != -1}
                    classes={'venue'}
                    ref={'v' + venue.id}
                    clickHandler={(toggle) => this.venueFilterSelected(venue)}
                />
            );
        }, this);
    }

    titleButtonHit(type) {

        if (type === 'days') {
            EventActions.toggleSelectAllDays();
        } else {
            EventActions.toggleSelectAllVenues();
        }
    }

    render() {
        var dayDivs = null;
        var venueDivs = null;
        if (this.state.filteredDays) {
            dayDivs = this.getDayDivs();
            venueDivs = this.state.filteredVenues != null ? this.getVenueDivs() : null;
        }

        var venueTitleButtonText = (EventStore.venueSelectionStatus) ? 'Select All' : 'Unselect All';
        var daysTitleButtonText = (EventStore.daysSelectionStatus) ? 'Select All' : 'Unselect All';

        return (
            <div>
                <Section title='Filter By Day' titleButtonText={daysTitleButtonText} titleButtonHit={this.titleButtonHit.bind(this, 'days')}>
                    <div id='filter-bar-day-filter-wrapper'>
                        <div id='filter-bar-day-filter'>
                            {dayDivs}
                        </div>
                    </div>
                </Section>
                <Section title='Filter By Venue' titleButtonText={venueTitleButtonText} titleButtonHit={this.titleButtonHit.bind(this)}>
                    <div id='filter-bar-venue-filter-wrapper'>
                        <div id='filter-bar-venue-filter'>
                            {venueDivs}
                        </div>
                    </div>
                </Section>
            </div>
        );
    }

}

export default FilterBar;
