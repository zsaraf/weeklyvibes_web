'use strict';

import { camelizeKeys } from 'humps';
import request from 'superagent';
import Promise from 'promise-polyfill';

const APIUtils = {

    rootUrl() {
        var parts = location.hostname.split('.');
        var subdomain = parts.shift();
        var upperleveldomain = parts.join('.');

        if (upperleveldomain == 'localhost') {
            return 'http://localhost:8000/django/';
        } else {
            return 'https://sf.weeklyvibes.co/django/';
        }
    },

    normalizeResponse(response) {
        return camelizeKeys(response.body);
    },

    get(path) {
        return new Promise((resolve, reject) => {
            request.get(this.rootUrl() + path)
            .accept('application/json')
            .end((err, res) => {
                if (err || !res.ok) {
                    reject(res.statusCode);
                } else {
                    resolve(this.normalizeResponse(res));
                }
            });
        });
    },

};

export default APIUtils;
