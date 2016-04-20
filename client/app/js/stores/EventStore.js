'use strict';

import Reflux from 'reflux';

import EventActions from '../actions/EventActions';
import AuthAPI from '../utils/AuthAPI';

const EventStore = Reflux.createStore({

    init() {
        this.events = null;
        this.hasBeenChecked = false;

        this.listenToMany(EventActions);
    },

    setEvents(events) {
        console.log('setging eventS: ' + events);
        this.events = events;
        this.trigger(null, this.events);
    },

    throwError(err) {
        this.trigger(err);
    },

    getEvents(region) {

        AuthAPI.getEvents(region).then(events => {
            this.hasBeenChecked = true;
            this.setEvents(events.events);
        }).catch(err => {
            this.hasBeenChecked = true;
            this.throwError(err);
        });
    },

});

export default EventStore;
