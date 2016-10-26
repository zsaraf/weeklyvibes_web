'use strict';

import APIUtils from './APIUtils';
import $ from 'jquery';

const AuthAPI = {

    getEvents(region) {
        return APIUtils.get('vibes/regions/get_events/?region=' + region);
    },

    setWVPopularityForEvent(e, popularity) {
        return APIUtils.post('vibes/events/' + e.id + '/set_wv_popularity/', {wv_popularity: popularity});
    }

};

export default AuthAPI;
