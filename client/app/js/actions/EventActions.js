'use strict';

import Reflux from 'reflux';

const EventActions = Reflux.createActions([
    'getEvents',
    'eventSelected',
    'venueFilterSelected',
    'dayFilterSelected',
    'updateBrowserHistoryWithEvent',
    'toggleSelectAll'
]);

export default EventActions;
