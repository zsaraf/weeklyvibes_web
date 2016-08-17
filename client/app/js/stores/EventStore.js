'use strict';

import Reflux           from 'reflux';

import EventActions     from '../actions/EventActions';
import AuthAPI          from '../utils/AuthAPI';
import moment           from 'moment-timezone';
import WVUtils          from '../utils/WVUtils';
import {browserHistory} from 'react-router';
import _                from 'lodash';
import ImagePreloader   from '../utils/ImagePreloader';
import Cookies          from 'js-cookie';

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

    updateBrowserHistory() {
        browserHistory.replace('/event/' + WVUtils.getURLStringForEvent(this.currentEvent));
    },

    eventWithId(eventId) {
        for (var e of this.events) {
            var eId = WVUtils.getURLStringForEvent(e);
            if (eId == eventId) return e;
        }

        return null;
    },

    setEvents(events, venues, eventId) {
        this.currentEvent = events[0];
        this.events = events;
        this.filteredEvents = events;
        this.venues = venues;
        this.filteredVenues = venues;
        this.filteredDays = this.days;

        // Check if the user has already filtered venues (f_v)
        var fvCookie = Cookies.get('f_v');
        if (fvCookie) {

            // Convert to real object
            var venueIds = JSON.parse(fvCookie);
            if (venueIds.length > 0) {
                this.filteredVenues = [];
            }

            // Iterate and add to filtered venues
            for (var vid of venueIds) {
                var venue = WVUtils.getVenueWithId(venues, vid);
                this.filteredVenues.push(venue);
            }

            if (venueIds.length > 0) {
                this.updateFilteredEvents(this.filteredVenues, this.filteredDays);
            }
        }

        // Pre-load all the images
        var imgUrls = [];
        this.events.map(function (e) {
            var artist = e.eventArtists[0].artist;
            imgUrls.push(artist.imgSrc);
        }, imgUrls);

        ImagePreloader.preload(imgUrls, () => {
            this.storeUpdated();
        });

        // If the user came with a url in mind -- try to find it
        if (eventId) {
            var e = this.eventWithId(eventId);
            if (e) {
                var index = WVUtils.getIndexOfEventInEvents(e, events);
                this.currentEvent = events[index];
            }
        } else {
            this.updateBrowserHistory();
        }

    },

    throwError(err) {
        this.trigger(err);
    },

    getEvents(region, eventId) {
        console.log('EventStore::getEvents()');
        AuthAPI.getEvents(region).then(events => {
            this.setEvents(events.events, events.venues, eventId);
        }).catch(err => {
            this.throwError(err);
        });
    },

    eventSelected(event) {
        console.log('EventStore::eventSelected()');
        this.currentEvent = event;
        this.updateBrowserHistory();
        this.storeUpdated();
    },

    venueFilterSelected(venue) {
        console.log('EventStore::venueFilterSelected()');

        var filteredVenues = this.filteredVenues.slice();
        WVUtils.toggle(venue, filteredVenues);
        this.updateFilteredEvents(filteredVenues, this.filteredDays, true);

        this.storeUpdated();
    },

    dayFilterSelected(day) {
        console.log('EventStore::dayFilterSelected()');

        var filteredDays = this.filteredDays.slice();
        WVUtils.toggle(day, filteredDays);
        this.updateFilteredEvents(this.filteredVenues, filteredDays, true);

        this.storeUpdated();
    },

    updateFilteredEvents(filteredVenues, filteredDays, setCookie) {
        var filteredEvents = [];

        // Set the cookie to represent the filtered venues
        var filteredVenueIds = filteredVenues.map(function (v) {
            return v.id;
        });

        // Actually set the cookie
        if (setCookie) {
            Cookies.set('f_v', JSON.stringify(filteredVenueIds), { expires: 7 });
        }

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
