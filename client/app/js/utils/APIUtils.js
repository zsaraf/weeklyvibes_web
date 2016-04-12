'use strict';

import { camelizeKeys } from 'humps';
import request from 'superagent';
import Promise from 'promise-polyfill';

const APIUtils = {

    rootUrl() {
        if (document.location.hostname == 'localhost') {
            return 'http://localhost:8000/django/';
        } else {
            return 'https://daymix.net/django/';
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
