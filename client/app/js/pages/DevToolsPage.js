'use strict';

import React                    from 'react';
import DocumentTitle            from 'react-document-title';
import DevActions               from '../actions/DevActions';
import DevStore                 from '../stores/DevStore';
import EventList                from '../components/dev/EventList';

class DevToolsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentEvent: null,
            events: null,
            venues: null
        };
    }

    onDevStoreChanged(
        err,
        currentEvent,
        events,
        venues
    ) {
        if (err) {
            console.log(err);
        } else {
            this.setState({
                events: events,
                currentEvent: currentEvent,
                venues: venues
            });
        }
    }

    componentDidMount() {
        this.unsubscribeDev = DevStore.listen(this.onDevStoreChanged.bind(this));
        var parts = location.hostname.split('.');
        var subdomain = parts.shift();
        DevActions.getEvents(subdomain, -1);
    }

    componentWillUnmount() {
        this.unsubscribeDev();
    }

    render() {
        return (
            <DocumentTitle title={'Dev Tools'}>
                <div id='devtools-page'>
                    <EventList
                        currentEvent={this.state.currentEvent}
                        events={this.state.events} />
                </div>
            </DocumentTitle>
        );
    }
}

export default DevToolsPage;
