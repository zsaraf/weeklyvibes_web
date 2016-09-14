'use strict';

import Reflux           from 'reflux';
import PlaybackActions  from '../actions/PlaybackActions';
import AuthAPI          from '../utils/AuthAPI';
import moment           from 'moment-timezone';
import WVUtils          from '../utils/WVUtils';
import EventStore       from '../stores/EventStore';

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
            var maybelt = this.positionInQueue == count ? '>' : '';
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

        if (this.currentSong.id === song.id) {
            return;
        }

        // Cut the queue
        this.songQueue = this.songQueue.slice(0, (this.positionInQueue + 1));

        // Update our position
        this.positionInQueue++;

        // Add the rest of the event and future events to queue
        this.addCurrentEventAndFutureToQueueFromSong(song);

        // Start playing
        this.isPlaying = true;

        // this.debugPrintSongQueue();
    },

    addCurrentEventAndFutureToQueueFromSong(song) {
        // First find the current events
        var currentEvents = EventStore.filteredEvents;
        var currentEvent = EventStore.currentEvent;
        var eeas = WVUtils.findEEASPosition(song, currentEvents, currentEvent);

        // Loop through remaining songs in current event
        var songIndex = eeas[2];
        for (var i = eeas[1]; i < currentEvent.eventArtists.length; i++) {
            var ea = currentEvent.eventArtists[i];
            for (var j = songIndex; j < ea.artist.songs.length; j++) {
                this.songQueue.push(ea.artist.songs[j]);
            }

            songIndex = 0;
        }

        if (eeas[0] < currentEvents.length - 1) {
            this.addEventsToQueue(currentEvents.slice(eeas[0] + 1, currentEvents.length));
        } else {
            this.currentSong = this.songQueue[this.positionInQueue];
            this.storeUpdated();
        }
    },

    // If they hit a specific url -- play the first song from that event
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
        this.storeUpdated();
    }

});

export default PlaybackStore;
