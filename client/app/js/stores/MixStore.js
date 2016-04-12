'use strict';

import Reflux from 'reflux';

import MixActions from '../actions/MixActions';
import AuthAPI from '../utils/AuthAPI';

const MixStore = Reflux.createStore({

    init() {
        this.dayMix = null;
        this.hasBeenChecked = false;

        this.listenToMany(MixActions);
    },

    setDayMix(dayMix) {
        this.dayMix = dayMix;
        this.trigger(null, this.dayMix);
    },

    throwError(err) {
        this.trigger(err);
    },

    getDayMix(forDate) {

        if (this.dayMix && this.dayMix.forDate == forDate) {
            console.log('asdf');
            this.setDayMix(this.dayMix);
        } else {
            AuthAPI.getDayMix(forDate).then(dayMix => {
                this.hasBeenChecked = true;
                this.setDayMix(dayMix);
            }).catch(err => {
                this.hasBeenChecked = true;
                this.throwError(err);
            });
        }
    },

});

export default MixStore;
