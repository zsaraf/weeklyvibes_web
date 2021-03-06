'use strict';

import React                                       from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import App                                         from './App';
import HomePage                                    from './pages/HomePage';
import DevToolsPage                                from './pages/DevToolsPage';
import NotFoundPage                                from './pages/NotFoundPage';

export default (
    <Router history={browserHistory}>
        <Route path="/" component={App}>

            <IndexRoute component={HomePage} />
            <Route path='/event/:eventId' component={HomePage} />
            <Route path='/devtools' component={DevToolsPage} />
            <Route path="*" component={NotFoundPage} />

        </Route>
    </Router>
);
