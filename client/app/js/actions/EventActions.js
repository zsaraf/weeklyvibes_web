'use strict';

import Reflux from 'reflux';

const EventActions = Reflux.createActions([
    'getEvents',
    'eventEventArtistSelected',
    'venueFilterSelected',
    'dayFilterSelected',
    'updateBrowserHistoryWithEvent',
    'toggleSelectAll'
]);

export default EventActions;
