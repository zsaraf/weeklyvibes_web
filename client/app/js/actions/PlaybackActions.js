'use strict';

import Reflux from 'reflux';

const PlaybackActions = Reflux.createActions([
    'nextSong',
    'previousSong',
    'pause',
    'play',
    'playSong',
    'addCurrentEventAndFutureToQueueFromSong'
]);

export default PlaybackActions;
