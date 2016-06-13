'use strict';

const WVUtils = {

    getIndexOfEventInEvents(event, events) {
        var count = 0;
        for (var e of events) {
            if (e.id == event.id) {
                return count;
            } else {
                count++;
            }
        }

        return 0;
    },

    toggle(obj, array) {
        var index = array.indexOf(obj);
        if (index === -1) {
            array.push(obj);
        } else {
            array.splice(index, 1);
        }
    }

};

export default WVUtils;
