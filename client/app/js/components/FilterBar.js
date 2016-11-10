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
            filteredDays: EventStore.filteredDays,
            selectionStatus: 0
        };
    }

    onEventStoreChanged(
        err,
        currentEvent,
        filteredEvents,
        filteredVenues,
        filteredDays,
        selectionStatus,
        currentEventArtist,
        scrollToArtist
    ) {
        if (err) {
            console.log(err);
        } else {
            this.setState({
                filteredVenues: filteredVenues,
                filteredDays: filteredDays,
                selectionStatus: selectionStatus
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

    titleButtonHit(e) {
        e.preventDefault();

        var newStatus = this.state.selectionStatus ? 0 : 1;
        this.setState({
            selectionStatus: newStatus
        });

        EventActions.toggleSelectAll();
    }

    render() {
        var dayDivs = null;
        var venueDivs = null;
        if (this.state.filteredDays) {
            dayDivs = this.getDayDivs();
            venueDivs = this.state.filteredVenues != null ? this.getVenueDivs() : null;
        }

        var titleButtonText = (this.state.selectionStatus) ? 'Select All' : 'Unselect All';

        return (
            <div>
                <Section title='Filter By Day'>
                    <div id='filter-bar-day-filter-wrapper'>
                        <div id='filter-bar-day-filter'>
                            {dayDivs}
                        </div>
                    </div>
                </Section>
                <Section title='Filter By Venue' titleButtonText={titleButtonText} titleButtonHit={this.titleButtonHit.bind(this)}>
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
