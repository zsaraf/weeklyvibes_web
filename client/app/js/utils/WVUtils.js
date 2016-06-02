'use strict';

const WVUtils = {

    findEventWithId(events, eventId) {
        for (var e of events) {
            if (e.id == eventId) return e;
        }
    }

};

export default WVUtils;
