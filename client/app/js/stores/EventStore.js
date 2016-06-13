'use strict';

import Reflux from 'reflux';

import EventActions from '../actions/EventActions';
import AuthAPI      from '../utils/AuthAPI';
import moment       from 'moment-timezone';

const EventStore = Reflux.createStore({

    init() {
        this.events = null;
        this.venues = null;
        this.hasBeenChecked = false;

        /* Get possible days */
        var allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var currentDay = moment().format('e');
        if (currentDay > 0) {
            allDays = allDays.slice(currentDay - 1);
        }

        this.days = allDays;

        this.listenToMany(EventActions);
    },

    setEvents(events, venues) {
        this.events = events;
        this.venues = venues;
        this.trigger(null, this.events, this.venues);
    },

    throwError(err) {
        this.trigger(err);
    },

    getEvents(region) {

        AuthAPI.getEvents(region).then(events => {
            this.hasBeenChecked = true;
            this.setEvents(events.events, events.venues);
        }).catch(err => {
            this.hasBeenChecked = true;
            this.throwError(err);
        });
    },

});

export default EventStore;
