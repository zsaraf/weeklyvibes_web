'use strict';

import Reflux from 'reflux';

const EventActions = Reflux.createActions([
    'getEvents',
    'eventEventArtistSelected',
    'venueFilterSelected',
    'dayFilterSelected',
    'updateBrowserHistoryWithEvent',
    'toggleSelectAllVenues',
    'toggleSelectAllDays',
    'nextEvent',
    'previousEvent'
]);

export default EventActions;
