'use strict';

import React            from 'react';
import FilterToggle     from './FilterToggle';
import EventStore       from '../stores/EventStore';
import EventActions     from '../actions/EventActions';

class FilterBar extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            filteredVenues: null,
            filteredDays: null
        };
    }

    onEventStoreChanged(err, currentEvent, filteredEvents, filteredVenues, filteredDays) {
        if (err) {
            console.log(err);
        } else {
            this.setState({
                filteredVenues: filteredVenues,
                filteredDays: filteredDays
            });
        }
    }

    componentDidMount() {
        this.unsubscribeEvents = EventStore.listen(this.onEventStoreChanged.bind(this));
    }

    getDayDivs() {
        var allDays = EventStore.days;
        return allDays.map(function (day, i) {
            return (
                <FilterToggle
                    text={day}
                    key={i}
                    selected={this.state.filteredDays.indexOf(day) != -1}
                    clickHandler={(toggle) => EventActions.dayFilterSelected(day)}
                />
            );
        }, this);
    }

    getVenueDivs() {
        var allVenues = EventStore.venues;
        return allVenues.map(function (venue) {
            return (
                <FilterToggle
                    text={venue.name}
                    key={venue.id}
                    selected={this.state.filteredVenues.indexOf(venue) != -1}
                    clickHandler={(toggle) => EventActions.venueFilterSelected(venue)}
                />
            );
        }, this);
    }

    render() {
        var dayDivs = null;
        var venueDivs = null;
        if (this.state.filteredDays) {
            dayDivs = this.getDayDivs();
            venueDivs = this.state.filteredVenues != null ? this.getVenueDivs() : null;
        }

        return (
            <div id='filter-bar'>
                <div id='filter-bar-day-filter-wrapper'>
                    <h3>FILTER BY DAY</h3>
                    <div id='filter-bar-day-filter'>
                        {dayDivs}
                    </div>
                </div>
                <div id='filter-bar-venue-filter-wrapper'>
                    <h3>FILTER BY VENUE</h3>
                    <div id='filter-bar-venue-filter'>
                        {venueDivs}
                    </div>
                </div>
            </div>
        );
    }

}

export default FilterBar;
