'use strict';

import Reflux from 'reflux';

import EventActions from '../actions/EventActions';
import AuthAPI      from '../utils/AuthAPI';
import moment       from 'moment-timezone';
import WVUtils      from '../utils/WVUtils';
import _            from 'lodash';
import ImagePreloader   from '../utils/ImagePreloader';

const EventStore = Reflux.createStore({

    init() {
        /* Get possible days */
        var allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var currentDay = moment().format('e');
        if (currentDay > 0) {
            allDays = allDays.slice(currentDay - 1);
        }

        this.currentEvent = null;
        this.events = null;
        this.venues = null;
        this.days = allDays;
        this.filteredEvents = null;
        this.filteredVenues = null;
        this.filteredDays = null;

        this.listenToMany(EventActions);
    },

    storeUpdated() {
        this.trigger(null, this.currentEvent, this.filteredEvents, this.filteredVenues, this.filteredDays);
    },

    setEvents(events, venues) {
        this.currentEvent = events[0];
        this.events = events;
        this.filteredEvents = events;
        this.venues = venues;
        this.filteredVenues = venues;
        this.filteredDays = this.days;

        var imgUrls = [];
        this.events.map(function (e) {
            var artist = e.eventArtists[0].artist;
            imgUrls.push(artist.imgSrc);
        }, imgUrls);

        ImagePreloader.preload(imgUrls, () => {
            this.storeUpdated();
        });
    },

    throwError(err) {
        this.trigger(err);
    },

    getEvents(region) {
        console.log('EventStore::getEvents()');
        AuthAPI.getEvents(region).then(events => {
            this.setEvents(events.events, events.venues);
        }).catch(err => {
            this.throwError(err);
        });
    },

    eventSelected(event) {
        console.log('EventStore::eventSelected()');
        this.currentEvent = event;
        this.storeUpdated();
    },

    venueFilterSelected(venue) {
        console.log('EventStore::venueFilterSelected()');

        var filteredVenues = this.filteredVenues.slice();
        WVUtils.toggle(venue, filteredVenues);
        this.updateFilteredEvents(filteredVenues, this.filteredDays);

        this.storeUpdated();
    },

    dayFilterSelected(day) {
        console.log('EventStore::dayFilterSelected()');

        var filteredDays = this.filteredDays.slice();
        WVUtils.toggle(day, filteredDays);
        this.updateFilteredEvents(this.filteredVenues, filteredDays);

        this.storeUpdated();
    },

    updateFilteredEvents(filteredVenues, filteredDays) {
        var filteredEvents = [];

        EventStore.events.map(function (e) {
            var venue = e.venue;
            var day = moment(e.startDt).format('dddd');

            var dayFilter = filteredDays.indexOf(day) != -1;
            var venueFilter = _.find(filteredVenues, function (v) {
                return _.isEqual(venue, v);
            }) !== undefined;

            // console.log(venueFilter);

            if (dayFilter && venueFilter) {
                filteredEvents.push(e);
            }
        }, this, filteredEvents);

        this.filteredEvents = filteredEvents;
        this.filteredVenues = filteredVenues;
        this.filteredDays = filteredDays;
    }

});

export default EventStore;
