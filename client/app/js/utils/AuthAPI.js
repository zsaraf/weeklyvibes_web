'use strict';

import APIUtils from './APIUtils';
import $ from 'jquery';

const AuthAPI = {

    getDayMix(forDate) {
        if (!forDate) {
            return APIUtils.get('mix/day_mixes/today/');
        } else {
            return APIUtils.get('mix/day_mixes/' + forDate + '/');
        }
    },

};

export default AuthAPI;
