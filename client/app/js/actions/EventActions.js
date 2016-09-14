'use strict';

import Reflux from 'reflux';

const EventActions = Reflux.createActions([
    'getEvents',
    'eventSelected',
    'venueFilterSelected',
    'dayFilterSelected',
    'updateBrowserHistoryWithEvent'
]);

export default EventActions;
