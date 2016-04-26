'use strict';

import React            from 'react';
import $                from 'jquery';
import Link             from 'react-router';
import DocumentTitle    from 'react-document-title';
import Player           from '../components/Player';
import FilterBar        from '../components/FilterBar';
import EventPlaylist    from '../components/EventPlaylist';
import EventDetail      from '../components/EventDetail';
import Header           from '../components/Header';
import EventActions       from '../actions/EventActions';
import EventStore         from '../stores/EventStore';
import moment from 'moment-timezone';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            events: null,
            filteredEvents: null,
            currentEvent: null
        };
    }

    onEventsChange(err, events) {
        if (err) {
            console.log(err)
            // this.props.history.replace('/mixnotfound');
        } else {
            console.log('Found events: ' + events[0].id);
            console.log(events[0]);
            this.setState({
                loading: false,
                events: events,
                filteredEvents: events,
                currentEvent: events[0]
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.date != this.props.params.date) {
            $('.date-picker').removeClass('animated slideInRight');
            $('.date-picker').addClass('animated slideOutRight');

            $('#player-blur-container').css('opacity', 0);

            $('#bickgroundimage-container').fadeTo(1000, 0.0, function () {
                this.setState({ loading: true, dayMix: null });
                var loading = $('div.loading');
                loading.css('opacity', '0');
                loading.fadeTo(1000, 1.0, function () {
                    loading.css('opacity', '');
                    loading.css('animation', '');
                    MixActions.getDayMix(nextProps.params.date ? nextProps.params.date : null);
                }.bind(this));

            }.bind(this));

            $('#player').fadeTo(1000, 0.0, function () {});
        }
    }

    imageLoaded() {
        var loading = $('div.loading');
        loading.css('animation', 'none');
        loading.css('opacity', 1);
        loading.fadeTo(1000, 0.0, function () {
            this.setState({
                loading: false,
                dayMix: this.state.dayMix
            });

            $('#bickgroundimage-container').fadeTo(1000, 1.0, function () {
                $('#player-blur-container').fadeTo(500, 1.0, function () {
                    $('.date-picker').show();
                    $('.date-picker').removeClass('animated slideOutRight');
                    $('.date-picker').addClass('animated slideInRight');
                });
            });

            $('#player').fadeTo(1000, 1.0, function () {});
        }.bind(this));
    }

    componentDidMount() {
        this.unsubscribe = EventStore.listen(this.onEventsChange.bind(this));
        var parts = location.hostname.split('.');
        var subdomain = parts.shift();
        EventActions.getEvents(subdomain);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    backgroundImageClicked() {
        if (!this.state.loading) {
            if ($('#jplayer').data().jPlayer.status.paused) {
                $('#jplayer').jPlayer('play');
            } else {
                $('#jplayer').jPlayer('pause');
            }
        }
    }

    eventSelected(event) {
        this.setState({
            currentEvent: event
        });
    }

    render() {
        var loading = null;
        if (this.state.loading) {
            loading = (
                <div className='loading-wrapper'>
                    <div className='loading'>GATHERING VIBE TRIBES...</div>
                </div>
            );

        }

        return (
            <DocumentTitle title="Weekly Vibes">
                <div id="home-page">
                    <Header
                    />
                    <FilterBar
                        vibes={this.state.vibes}
                    />
                    <EventDetail
                        currentEvent={this.state.currentEvent}
                    />
                    <EventPlaylist
                        currentEvent={this.state.currentEvent}
                        eventSelected={this.eventSelected.bind(this)}
                        filteredEvents={this.state.filteredEvents}
                    />
                    <Player
                        loading={this.state.loading}
                        dayMix={this.state.dayMix}
                    />
                    {loading}
                </div>
            </DocumentTitle>
        );
    }
}

export default HomePage;
