import React            from 'react';
import $                from 'jquery';
import jPlayer          from 'jplayer';
import PlaybackStore    from '../stores/PlaybackStore';
import PlaybackActions  from '../actions/PlaybackActions';

class PlayerInfo extends React.Component {

    render() {
        return (
            <div id='player-info'>
                <div id='player-info-content'>
                    <div id='artist-name'>{this.props.artistName}</div>
                    <div id='song-name'>{this.props.songName}</div>
                </div>
            </div>
        );
    }
}

class PlayerDurationBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='player-duration-bar'>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div id='current-time'>00:00</div>
                            </td>
                            <td id='bar-container'>
                                <div id='outer-bar'>
                                    <div id='inner-bar' />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class PlayerControls extends React.Component {

    constructor(props) {
        super(props);
    }

    buttonClicked(e) {
        e.preventDefault();
        var jp = $('#jplayer');
        if (jp.data().jPlayer.status.paused) {
            jp.jPlayer('play');
        } else {
            jp.jPlayer('pause');
        }
    }

    previousButtonHit() {
        PlaybackActions.previousSong();
    }

    nextButtonHit() {
        PlaybackActions.nextSong();
    }

    render() {
        return (
            <div id='player-controls'>
                <div className='player-control-container' onClick={this.previousButtonHit}>
                    <div id='back-button' className='player-control-button' />
                </div>
                <div className='player-control-container' onClick={this.buttonClicked}>
                    <div id='pause-play' className='player-control-button' />
                </div>
                <div className='player-control-container' onClick={this.nextButtonHit}>
                    <div id='next-button' className='player-control-button' />
                </div>
            </div>
        );
    }
}

class Player extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentSong: null,
        };
    }

    playbackChanged(err, currentSong, isPlaying) {
        console.log('Playback changed: ' + currentSong);

        // Update the current song if necessary
        if (!this.state.currentSong || (this.state.currentSong.id != currentSong.id)) {
            this.setState({
                currentSong: currentSong
            });

            var _react = this;

            if ($('#jplayer').data().jPlayer) {
                $('#current-time').html('loading');
                $('#jplayer').jPlayer('setMedia', {
                    title: currentSong.name,
                    mp3: currentSong.s3Url
                });
            }

            $('#jplayer').jPlayer({
                ready: function () {
                    $(this).jPlayer('setMedia', {
                        title: currentSong.name,
                        mp3: currentSong.s3Url
                    });

                    if (PlaybackStore.isPlaying) {
                        $(this).jPlayer('play');
                    }

                    $('body').keypress(function (event) {
                        if (event.which == 32) {
                            event.preventDefault();
                            if ($(this).data().jPlayer.status.paused) {
                                PlaybackActions.play();
                            } else {
                                PlaybackActions.pause();
                            }
                        } else if (event.which == 107 || event.which == 106) {
                            var currentPercent = $(this).data().jPlayer.status.currentPercentAbsolute;
                            var thirtySecondsPercent = (30 / $(this).data().jPlayer.status.duration) * 100;

                            // seek forward 30 secs
                            if (event.which == 107) {
                                $(this).jPlayer('playHead', currentPercent + thirtySecondsPercent);
                            } else {
                                $(this).jPlayer('playHead', currentPercent - thirtySecondsPercent);
                            }

                            $('#current-time').html('loading');
                        } else if (event.which == 106) {

                            // seek backwards 30 secs
                            $(this).jPlayer('playHead', 10);
                            $('#current-time').html('loading');
                        } else if (event.which >= 48 && event.which <= 57) {
                            var percent = (event.which - 48) * 10;
                            $(this).jPlayer('playHead', percent);
                            $('#current-time').html('loading');
                        }
                    }.bind(this));

                    $('body').keydown(function (event) {
                        if (event.which == 37) {
                            // left arrow key
                            PlaybackActions.previousSong();
                        } else if (event.which == 39) {
                            // right arrow key
                            PlaybackActions.nextSong();
                        }
                    });
                },

                play: function (event) {
                    var playPauseIcon = $('#pause-play');
                    playPauseIcon.removeClass('play');
                },

                pause: function (event) {
                    var playPauseIcon = $('#pause-play');
                    playPauseIcon.addClass('play');
                },

                ended: function (event) {
                    PlaybackActions.nextSong();
                },

                progress: function (event) {
                    // console.log('progress: ' + event.jPlayer.status.seekPercent);
                },

                loadeddata: function (event) {
                    if (PlaybackStore.isPlaying) {
                        $('#jplayer').jPlayer('play');
                    }
                },

                timeupdate: function (event) {
                    var percent = event.jPlayer.status.currentPercentAbsolute;
                    var currentTimeSecs = event.jPlayer.status.currentTime;
                    $('#inner-bar').width(percent + '%');
                    $('#current-time').html($.jPlayer.convertTime(currentTimeSecs));
                },

                supplied: 'mp3'
            });
        } else {
            // If jplayer exists
            var jp = $('#jplayer');
            if (jp.data().jPlayer) {
                if (isPlaying) {
                    jp.jPlayer('play');
                } else {
                    jp.jPlayer('pause');
                }
            }

        }
    }

    componentDidMount() {
        this.unsubscribe = PlaybackStore.listen(this.playbackChanged.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render () {
        var songName = null;
        var artistName = null;
        if (this.state.currentSong != null) {
            songName = this.state.currentSong.name;
            artistName = this.state.currentSong.artist;
        }

        return (
            <div id='player' className='mobile-shift'>
                <PlayerControls />
                <PlayerInfo
                    songName={songName}
                    artistName={artistName}
                />
                <PlayerDurationBar />
                <div id='jplayer'></div>
            </div>
        );
    }
}

export default Player;
