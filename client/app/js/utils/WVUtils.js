'use strict';

const WVUtils = {

    alphanumericOnly(string) {
        return string.replace(/[^0-9a-zA-Z\s]/g, '');
    },

    getURLStringForEvent(e) {
        var artistName = this.alphanumericOnly(e.eventArtists[0].artist.name);
        var venueName = this.alphanumericOnly(e.venue.name);
        var title = artistName + '-' + venueName;
        return title.replace(/\s+/g, '-').toLowerCase();
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
    findEEASPosition(song, events, currentEvent) {
        var eventPosition = events.indexOf(currentEvent);

        console.log(eventPosition);

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
