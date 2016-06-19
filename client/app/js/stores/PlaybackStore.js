'use strict';

import Reflux           from 'reflux';
import PlaybackActions  from '../actions/PlaybackActions';
import AuthAPI          from '../utils/AuthAPI';
import moment           from 'moment-timezone';

const PlaybackStore = Reflux.createStore({

    init() {
        // Setup the vars we will need
        this.songQueue = [];
        this.currentSong = null;
        this.positionInQueue = 0;
        this.isPlaying = false;

        // Listen to the actions
        this.listenToMany(PlaybackActions);
    },

    debugPrintSongQueue() {
        console.log('Current song queue:');
        var count = 0;
        this.songQueue.forEach(function (song) {
            var maybelt = this.position == count ? '>' : '';
            console.log(maybelt + '\t' + song.artist + ' - ' + song.name);
            count++;
        }.bind(this));
    },

    storeUpdated() {
        this.trigger(null, this.currentSong, this.isPlaying);
    },

    nextSong() {
        console.log('PlaybackStore::nextSong()');
        this.positionInQueue++;
        if (this.positionInQueue >= this.songQueue.length) {
            console.log('PlaybackStore has reached end of queue');
            this.positionInQueue = this.songQueue.length - 1;
        } else {
            this.currentSong = this.songQueue[this.positionInQueue];
            this.storeUpdated();
        }
    },

    previousSong() {
        console.log('PlaybackStore::previousSong()');
        this.positionInQueue--;
        if (this.positionInQueue < 0) {
            console.log('PlaybackStore has reached beginning of queue');
            this.positionInQueue = 0;
        } else {
            this.currentSong = this.songQueue[this.positionInQueue];
            this.storeUpdated();
        }
    },

    pause() {
        console.log('PlaybackStore::pause()');
        this.isPlaying = false;
        this.storeUpdated();
    },

    play() {
        console.log('PlaybackStore::play()');
        this.isPlaying = true;
        this.storeUpdated();
    },

    playSong(song) {
        console.log('PlaybackStore::playSong()');
        this.songQueue = [song];
        this.currentSong = song;
        this.positionInQueue = 0;
        this.isPlaying = true;
        this.storeUpdated();
    },

    addEventsToQueue(events) {
        console.log('PlaybackStore::addEventsToQueue()');

        for (var e of events) {
            var songs = Array();
            var _pbstore = this;
            e.eventArtists.forEach(function (ea) {
                ea.artist.songs.forEach(function (s) {
                    _pbstore.songQueue.push(s);
                });
            });
        }

        this.currentSong = this.songQueue[this.positionInQueue];
    }

});

export default PlaybackStore;
