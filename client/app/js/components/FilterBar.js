'use strict';

import React from 'react';
import FilterToggle from './FilterToggle';
import moment from 'moment-timezone';

class FilterBar extends React.Component{

    constructor(props) {
        super(props);
    }

    getDayDivs() {
        var allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var currentDay = moment().format('e');
        if (currentDay > 0) {
            allDays = allDays.slice(currentDay - 1);
        }

        return allDays.map(function (day, i) {
                return (
                    <FilterToggle
                        text={day}
                        key={i}
                        onClick={() => this.props.daySelected(day)}
                    />
                );
        }, this);

    }

    getVenueDivs() {
        return this.props.venues.map(function (venue) {
            return (
                <FilterToggle
                    text={venue.name}
                    key={venue.id}
                    onClick={() => this.props.venueSelected(venue)}
                />
            );
        });
    }

    daySelected(day) {
        console.log(day)
    }

    venueSelected(venue) {
        console.log(venue)
    }

    render() {
        var dayDivs = this.getDayDivs();
        var venueDivs = this.props.venues != null ? this.getVenueDivs() : null;

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
