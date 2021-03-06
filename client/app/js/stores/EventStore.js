'use strict';

import Reflux           from 'reflux';

import PlaybackActions  from '../actions/PlaybackActions'
import EventActions     from '../actions/EventActions';
import AuthAPI          from '../utils/AuthAPI';
import moment           from 'moment-timezone';
import WVUtils          from '../utils/WVUtils';
import {browserHistory} from 'react-router';
import _                from 'lodash';
import ImagePreloader   from '../utils/ImagePreloader';
import Cookies          from 'js-cookie';
import $                from 'jquery';

const EventStore = Reflux.createStore({

    init() {
        /* Get possible days */
        var allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        this.currentEvent = null;
        this.currentEventArtist = null;
        this.events = null;
        this.venues = null;
        this.days = allDays;
        this.filteredEvents = null;
        this.filteredVenues = null;
        this.filteredDays = null;
        this.venueSelectionStatus = 0; // unselect all = 0 select all = 1
        this.daysSelectionStatus = 0;
        this.scrollToArtist = false;
        this.order = WVUtils.EventOrdering.WV_POPULARITY;

        $(document.body).on('keydown', this.handleKeyDown);

        this.listenToMany(EventActions);
    },

    storeUpdated() {
        this.trigger(
            null,
            this.currentEvent,
            this.filteredEvents,
            this.filteredVenues,
            this.filteredDays,
            this.currentEventArtist,
            this.scrollToArtist
        );
        this.scrollToArtist = false;
    },

    updateBrowserHistoryWithEvent(event) {
        browserHistory.replace('/event/' + WVUtils.getURLStringForEvent(event));
    },

    updateBrowserHistory() {
        browserHistory.replace('/event/' + WVUtils.getURLStringForEvent(this.currentEvent));
    },

    handleKeyDown(ev) {
        if (ev.keyCode == 40) {
            EventActions.nextEvent();
            ev.preventDefault();
        } else if (ev.keyCode == 38) {
            EventActions.previousEvent();
            ev.preventDefault();
        } else if (ev.keyCode == 13) {
            const eventArtist = this.currentEvent.eventArtists[0];
            if (eventArtist.artist.songs.length > 0) {
                const song = eventArtist.artist.songs[0];
                PlaybackActions.playSong(song);
            }
            ev.preventDefault();
        }
    },

    eventWithId(eventId) {
        for (var e of this.events) {
            var eId = WVUtils.getURLStringForEvent(e);
            if (eId == eventId) return e;
        }

        return null;
    },

    getVenuesFromEvents(events) {
        var venues = {};

        // Prevent duplicates
        for (var e of events) {
            if (!(e.venue.id in venues)) {
                venues[e.venue.id] = e.venue;
            }
        }

        var returnVenues = [];
        for (var key in venues) {
            returnVenues.push(venues[key]);
        }

        return returnVenues;
    },

    setEvents(events, eventId) {
        this.currentEvent = events[0];
        this.events = events;
        this.venues = this.getVenuesFromEvents(events);
        this.filteredVenues = this.venues;
        this.filteredDays = this.days;

        // Check if the user has already filtered venues (f_v)
        var fvCookie = Cookies.get('f_v');
        if (fvCookie) {
            // Convert to real object
            var venueIds = JSON.parse(fvCookie);
            if (venueIds.length > 0 && venueIds.length != this.venues.length) {
                this.filteredVenues = [];
                for (var vid of venueIds) {
                    var venue = WVUtils.getVenueWithId(this.venues, vid);
                    if (venue) this.filteredVenues.push(venue);
                }
            } else {
                Cookies.remove('f_v');
            }
        }

        // Set filtered events
        this.updateFilteredEvents(this.filteredVenues, this.filteredDays, false);

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
            this.setEvents(events.events, eventId);
        }).catch(err => {
            this.throwError(err);
        });
    },

    eventEventArtistSelected(event, eventArtist) {
        console.log('EventStore::eventSelected()');
        this.scrollToArtist = true;
        this.currentEvent = event;
        this.currentEventArtist = eventArtist;
        this.updateBrowserHistory();
        this.storeUpdated();
    },

    venueFilterSelected(venue) {
        console.log('EventStore::venueFilterSelected()');
        var filteredVenues = this.filteredVenues.slice();

        // If every venue is selected
        if (filteredVenues.length === this.venues.length) {
            filteredVenues = [venue];
        } else {
            WVUtils.toggle(venue, filteredVenues);
        }

        this.updateFilteredEvents(filteredVenues, this.filteredDays, true);
        this.storeUpdated();
    },

    dayFilterSelected(day) {
        console.log('EventStore::dayFilterSelected()');

        var filteredDays = this.filteredDays.slice();

        // If every day is selected, only select that day
        if (filteredDays.length === this.days.length) {
            filteredDays = [day];
        } else {
            WVUtils.toggle(day, filteredDays);
        }

        this.updateFilteredEvents(this.filteredVenues, filteredDays, true);

        this.storeUpdated();
    },

    sortEventsByOrder(order) {
        console.log('EventStore::sortEventsByOrder(' + order + ')');
        this.order = order;
        this.updateFilteredEvents(this.filteredVenues, this.filteredDays, false);
        this.storeUpdated();
    },

    compareEvents(a, b) {
        var score = 0;
        switch (this.order) {
            case WVUtils.EventOrdering.WV_POPULARITY:
                score = b.wvPopularity - a.wvPopularity;
                break;
            case WVUtils.EventOrdering.SUPPOSED_POPULARITY:
                score = b.popularity - a.popularity;
                break;
            case WVUtils.EventOrdering.ALPHABETICAL:
                score = a.eventArtists[0].artist.name.localeCompare(b.eventArtists[0].artist.name);
                break;
            case WVUtils.EventOrdering.CHRONOLOGICAL:
                score = moment.tz(a.startDt, a.venue.timezone).unix() - moment.tz(b.startDt, b.venue.timezone).unix();
                break;
            default:
                return 0;
        }

        // Default to supposed popularity
        if (score == 0) {
            score = b.popularity - a.popularity;
        }

        return score;
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

        // Sort the events with the appropriate order
        EventStore.events.sort(this.compareEvents);

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

        if (this.filteredVenues.length == this.venues.length) {
            this.venueSelectionStatus = 0;
        } else {
            this.venueSelectionStatus = 1;
        }

        if (this.filteredDays.length === this.days.length) {
            this.daysSelectionStatus = 0;
        } else {
            this.daysSelectionStatus = 1;
        }
    },

    toggleSelectAllVenues() {
        console.log('EventStore::toggleSelectAllVenues()');
        var newVenues = []
        if (this.venueSelectionStatus) {
            newVenues = this.venues;
        }
        this.updateFilteredEvents(newVenues, this.filteredDays, true);
        this.storeUpdated();
    },

    toggleSelectAllDays() {
        console.log('EventStore::toggleSelectAllDays()');
        var newDays = []
        if (this.daysSelectionStatus) {
            newDays = this.days;
        }
        this.updateFilteredEvents(this.filteredVenues, newDays, true);
        this.storeUpdated();
    },

    nextEvent() {
        const idx = Math.max(Math.min(this.filteredEvents.indexOf(this.currentEvent) + 1, this.filteredEvents.length - 1), 0);
        this.eventEventArtistSelected(this.filteredEvents[idx], null);
    },

    previousEvent() {
        const idx = Math.max(Math.min(this.filteredEvents.indexOf(this.currentEvent) - 1, this.filteredEvents.length - 1), 0);
        this.eventEventArtistSelected(this.filteredEvents[idx], null);
    },

});

export default EventStore;
