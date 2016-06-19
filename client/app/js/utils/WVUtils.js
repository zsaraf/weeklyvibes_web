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
    },

    findEventWithSongId(songId, events) {
        for (var e of events) {
            for (var ea of e.eventArtists) {
                for (var song of ea.artist.songs) {
                    if (song.id == songId) {
                        return e;
                    }
                }
            }
        }

        return null;
    },

    shareUrlForEvent(eventId) {
        return 'http://sf.weeklyvibes.co?e=' + eventId;
    }

};

export default WVUtils;
