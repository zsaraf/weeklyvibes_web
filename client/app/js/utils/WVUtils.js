'use strict';

import moment from 'moment-timezone';
import EventStore from '../stores/EventStore';

const WVUtils = {

    alphanumericOnly(string) {
        return string.replace(/[^0-9a-zA-Z\s]/g, '');
    },

    getURLStringForEvent(e) {
        var artistName = this.alphanumericOnly(e.eventArtists[0].artist.name);
        var venueName = this.alphanumericOnly(e.venue.name);
        var title = artistName + '-' + venueName;
        return e.id + '-' + title.replace(/\s+/g, '-').toLowerCase();
    },

    addOrUpdateUrlParam(name, value) {
        var href = window.location.href;
        var regex = new RegExp('[&\\?]' + name + '=');
        if (regex.test(href)) {
            regex = new RegExp('([&\\?])' + name + '=\\d+');
            window.location.href = href.replace(regex, '$1' + name + '=' + value);
        } else {
            if (href.indexOf('?') > -1)
                window.location.href = href + '&' + name + '=' + value;
            else
                window.location.href = href + '?' + name + '=' + value;
        }
    },

    getVenueWithId(venues, id) {
        for (var v of venues) {
            if (v.id == id) return v;
        }
        return null;
    },

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

    stripPxToInt(val) {
        return parseInt(val.replace('px', ''));
    },

    findEventEventArtistWithSongId(songId) {
        var retea = null;
        var rete = null;
        for (var e of EventStore.events) {
            for (var ea of e.eventArtists) {
                for (var song of ea.artist.songs) {
                    if (song.id == songId) {
                        return [e, ea];
                    }
                }
            }
        }
    },

    // Event, EventArtist, Song (EEAS)
    findEEASPosition(song, events, currentEvent) {
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

    getDayStringForEvent(e) {
        return moment.tz(e.startDt, e.venue.timezone).format('ddd');
    },

    shareUrlForEvent(e) {
        return 'http://sf.weeklyvibes.co/event/' + this.getURLStringForEvent(e);
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
