'use strict';

class SongQueue {

    constructor(event) {
        this.songQueue = this.createSongQueueForEvent(event);
        this.currentSong = this.songQueue[0];
        this.position = 0;
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

    addEventToQueue(event) {
        this.songQueue.push.apply(this.songQueue, this.createSongQueueForEvent(event));
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
