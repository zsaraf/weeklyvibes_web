'use strict';

import React            from 'react';
import FilterToggle     from './FilterToggle';
import EventStore       from '../stores/EventStore';
import EventActions     from '../actions/EventActions';
import Section          from './reusable/Section';

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
