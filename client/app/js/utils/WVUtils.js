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

    // Event, EventArtist, Song (EEAS)
    findEEASPosition(song, events) {
        var currentEvent = this.findEventWithSongId(song.id, events);
        var eventPosition = events.indexOf(currentEvent);
        var eventArtistPosition = 0;
        var songPosition = 0;
        var foundSong = false;
        for (var ea of currentEvent.eventArtists) {
            for (var s of ea.artist.songs) {
                if (s.id == song.id) {
                    foundSong = true;
                    break;
                } else {
                    songPosition++;
                }
            }

            if (!foundSong) {
                songPosition = 0;
                eventArtistPosition++;
            } else {
                break;
            }
        }

        return [eventPosition, eventArtistPosition, songPosition];
    },

    shareUrlForEvent(eventId) {
        return 'http://sf.weeklyvibes.co?e=' + eventId;
    },

    isDev() {
        if (document.location.hostname.indexOf('localhost') !== -1) {
            return true;
        } else {
            return false;
        }
    }

};

export default WVUtils;
