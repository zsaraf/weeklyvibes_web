'use strict';

import Reflux           from 'reflux';

import PlaybackActions  from '../actions/PlaybackActions'
import DevActions       from '../actions/DevActions';
import AuthAPI          from '../utils/AuthAPI';
import moment           from 'moment-timezone';
import WVUtils          from '../utils/WVUtils';
import {browserHistory} from 'react-router';
import _                from 'lodash';
import ImagePreloader   from '../utils/ImagePreloader';
import Cookies          from 'js-cookie';
import $                from 'jquery';

const DevStore = Reflux.createStore({

    init() {
        this.currentEvent = null;
        this.events = null;
        this.venues = null;

        this.listenToMany(DevActions);
    },

    storeUpdated() {
        this.trigger(null, this.currentEvent, this.events, this.venues);
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

    updateWVPopularityForEvent(e, popularity) {
        AuthAPI.setWVPopularityForEvent(e, popularity).then(events => {
            this.setEvents(events.events);
        }).catch(err => {
            this.throwError(err);
        });
    },

    setEvents(events) {
        this.currentEvent = events[0];
        this.events = events;
        this.venues = this.getVenuesFromEvents(events);

        // Pre-load all the images
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
            this.setEvents(events.events);
        }).catch(err => {
            this.throwError(err);
        });
    }
});

export default DevStore;
