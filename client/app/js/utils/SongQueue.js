'use strict';

class SongQueue {

    constructor(event) {
        this.songQueue = this.createSongQueueForEvent(event);
        this.currentSong = this.songQueue[0];
        this.currentEvent = event;
        this.position = 0;
    }

    debugPrintSongQueue() {
        console.log('Current song queue:');
        var count = 0;
        this.songQueue.forEach(function (song) {
            var maybelt = this.position == count ? '>' : '';
            console.log(maybelt + '\t' + song.artist + ' - ' + song.name);
            count++;
        }.bind(this));
    }

    createSongQueueForEvent(e) {
        var songs = Array();
        e.eventArtists.forEach(function (ea) {
            ea.artist.songs.forEach(function (s) {
                songs.push(s);
            });
        });

        return songs;
    }

    replaceQueueWithEvent(event) {
        this.songQueue = this.createSongQueueForEvent(event);
        this.position = 0;
        this.currentEvent = event;
        this.currentSong = this.songQueue[0];
    }

    getCurrentSong() {
        return this.currentSong;
    }

    getNextSong() {
        var nextPosition = this.position + 1;
        if (nextPosition >= this.songQueue.length) {
            return null;
        } else {
            this.position = nextPosition;
            return this.songQueue[nextPosition];
        }
    }

    getPreviousSong() {
        var prevPosition = this.position - 1;
        if (prevPosition < 0) {
            return this.currentSong;
        } else {
            this.position = prevPosition;
            return this.songQueue[prevPosition];
        }
    }
};

export default SongQueue;
