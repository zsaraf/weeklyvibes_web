'use strict';

import Reflux from 'reflux';

const EventActions = Reflux.createActions([
    'getEvents',
    'eventEventArtistSelected',
    'venueFilterSelected',
    'dayFilterSelected',
    'updateBrowserHistoryWithEvent',
    'toggleSelectAll',
    'nextEvent',
    'previousEvent'
]);

export default EventActions;
