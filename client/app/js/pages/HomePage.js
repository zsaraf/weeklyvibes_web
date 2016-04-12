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
import MixActions       from '../actions/MixActions';
import MixStore         from '../stores/MixStore';
import moment from 'moment-timezone';

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            vibes: null,
            filteredEvents: null,
            currentEvent: null
        };
    }

    onDayMixChange(err, dayMix) {
        if (err) {
            this.props.history.replace('/mixnotfound');
        } else {
            this.setState({ dayMix: dayMix || {}, error: null, loading: true });
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
        // this.unsubscribe = MixStore.listen(this.onDayMixChange.bind(this));
        // var today = moment.tz(new Date(), 'America/Los_Angeles').startOf('day');
        // var date = moment.tz(this.props.params.date, 'America/Los_Angeles');
        // if (today.diff(date, 'days') < 0) {
        //     MixActions.getDayMix(null);
        // } else {
        //     MixActions.getDayMix(this.props.params.date ? this.props.params.date : null);
        // }
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

    render() {
        var loading = null;
        if (this.state.loading) {
            loading = (
                <div className='loading'>PREPARING MIX...</div>
            );

        }

        return (
            <DocumentTitle title="Daymix">
                <div id="home-page">
                    <Header
                    />
                    <div id='middle-content'>
                        <FilterBar
                            vibes={this.state.vibes}
                        />
                        <EventDetail
                            currentEvent={this.state.currentEvent}
                        />
                        <EventPlaylist
                            currentEvent={this.state.currentEvent}
                            filteredEvent={this.state.filteredEvents}
                        />
                    </div>
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
