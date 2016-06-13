'use strict';

import React        from 'react';
import FilterToggle from './FilterToggle';
import EventStore   from '../stores/EventStore';

class FilterBar extends React.Component{

    constructor(props) {
        super(props);
    }

    getDayDivs() {
        var allDays = EventStore.days;
        return allDays.map(function (day, i) {
            return (
                <FilterToggle
                    text={day}
                    key={i}
                    selected={this.props.filteredDays.indexOf(day) != -1}
                    clickHandler={(toggle) => this.props.dayToggled(day) /* this.props.daySelected(day) */}
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
                    selected={this.props.filteredVenues.indexOf(venue) != -1}
                    clickHandler={(toggle) => this.props.venueToggled(venue)}
                />
            );
        }, this);
    }

    render() {
        var dayDivs = this.getDayDivs();
        var venueDivs = this.props.filteredVenues != null ? this.getVenueDivs() : null;

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
