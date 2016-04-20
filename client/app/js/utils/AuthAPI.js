'use strict';

import APIUtils from './APIUtils';
import $ from 'jquery';

const AuthAPI = {

    getEvents(region) {
        return APIUtils.get('vibes/regions/get_events/?region=' + region);
    },

};

export default AuthAPI;
