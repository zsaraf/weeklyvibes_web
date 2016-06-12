import React from 'react';
import $ from 'jquery';
import jPlayer from 'jplayer';

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

    render() {
        return (
            <div id='player-controls'>
                <div className='player-control-container' onClick={this.props.previousButtonHit}>
                    <div id='back-button' className='player-control-button' />
                </div>
                <div className='player-control-container' onClick={this.buttonClicked}>
                    <div id='pause-play' className='player-control-button' />
                </div>
                <div className='player-control-container' onClick={this.props.nextButtonHit}>
                    <div id='next-button' className='player-control-button' />
                </div>
            </div>
        );
    }
}

class Player extends React.Component {

    constructor(props) {
        super(props);
    }

    zeroPad(num) {
        var zero = 2 - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join('0') + num;
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.song && !this.props.song) || (nextProps.song && nextProps.song.id != this.props.song.id)) {
            var song = nextProps.song;
            var _react = this;

            if ($('#jplayer').data().jPlayer) {
                $('#current-time').html('loading');
                $('#jplayer').jPlayer('setMedia', {
                    title: song.name,
                    mp3: song.s3Url
                });
            }

            $('#jplayer').jPlayer({
                ready: function () {
                    $(this).jPlayer('setMedia', {
                        title: song.name,
                        mp3: song.s3Url
                    });

                    if (_react.props.loading == false) {
                        $(this).jPlayer('play');
                    }

                    $('body').keypress(function (event) {
                        if (event.which == 32) {
                            event.preventDefault();
                            if ($(this).data().jPlayer.status.paused) {
                                $(this).jPlayer('play');
                            } else {
                                $(this).jPlayer('pause');
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
                            _react.props.previousSongHit();
                        } else if (event.which == 39) {
                            // right arrow key
                            _react.props.nextSongHit();
                        }
                    });
                },

                loadeddata: function (event) {
                    // $('#duration').html($.jPlayer.convertTime(event.jPlayer.status.duration));
                    $('#jplayer').jPlayer('play');
                },

                play: function (event) {
                    var playPauseIcon = $('#pause-play');
                    playPauseIcon.removeClass('play');
                },

                pause: function (event) {
                    var playPauseIcon = $('#pause-play');
                    playPauseIcon.addClass('play');
                },

                progress: function (event) {
                    // console.log('progress: ' + event.jPlayer.status.seekPercent);
                },

                timeupdate: function (event) {
                    var percent = event.jPlayer.status.currentPercentAbsolute;
                    if (percent >= 100) {
                        _react.props.nextSongHit();
                    }

                    var currentTimeSecs = event.jPlayer.status.currentTime;
                    $('#inner-bar').width(percent + '%');
                    $('#current-time').html($.jPlayer.convertTime(currentTimeSecs));
                },

                supplied: 'mp3'
            });
        }
    }

    render () {
        var title = null;
        var artist = null;
        var playerInfo = null;
        if (this.props.dayMix) {
            title = (
                <div id='title'>{this.props.dayMix.title}</div>
            );

            artist = (
                <div id='artist'>{this.props.dayMix.artist}</div>
            );

            playerInfo = (
                <PlayerInfo />
            );
        }

        var songName = null;
        var artistName = null;
        if (this.props.song != null) {
            songName = this.props.song.name;
            artistName = this.props.song.artist;
        }

        return (
            <div id='player' className='mobile-shift'>
                <PlayerControls
                    nextButtonHit={this.props.nextSongHit}
                    previousButtonHit={this.props.previousSongHit}
                />
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
