'use strict';

const WVUtils = {

    // Actually don't need this
    // findEventWithId(events, eventId) {
    //     for (var e of events) {
    //         if (e.id == eventId) return e;
    //     }
    // }

    getIndexOfEventInEvents(event, events) {
        var count = 0;
        for (var e of events) {
            if (e.id = event.id) {
                return count;
            } else {
                count++;
            }
        }

        return 0;
    }

};

export default WVUtils;
