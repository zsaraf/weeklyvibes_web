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

class PlayerBar extends React.Component {

    constructor(props) {
        super(props);
    }

    handleBarContainerClick(e) {
        var barContainer = this.refs.barContainer;
        var xHit = e.pageX - barContainer.offsetLeft;
        var percent = (xHit / barContainer.offsetWidth) * 100;
        this.props.playerBarChanged(this, percent);
        $('#jplayer').jPlayer('playHead', percent);
    }

    // $('#duration-bar.inner-bar').width(percent + '%');
    // var translatePercent = 0;
    // var seekerLeft = 0;
    // if ($('#duration-bar.inner-bar').width() > 4) {
    //     translatePercent = 50;
    //     seekerLeft = percent;
    // }
    //
    // $('#duration-bar.seeker').css({ left: seekerLeft + '%', transform: 'translate(-' + translatePercent + '%, 0)' });
    // $('#duration-bar.current-time').html($.jPlayer.convertTime(currentTimeSecs));

    render() {
        var innerBarStyle = {
            width: this.props.currentProgress + '%'
        };
        var seekerStyle = {
            left: this.props.currentProgress + '%',
            translate: '-50%, 0'
        };
        console.log(innerBarStyle);
        return (
            <div className='player-bar'>
                <div className='bar-container' onClick={this.handleBarContainerClick.bind(this)} ref='barContainer'>
                    <div className='outer-bar'>
                        <div className='inner-bar' style={innerBarStyle} />
                        <div className='seeker' style={seekerStyle} />
                    </div>
                </div>
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
        if (PlaybackStore.isPlaying) {
            PlaybackActions.pause();
        } else {
            PlaybackActions.play();
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
                    <div id='back-button' className='player-control-button' onClick={this.previousButtonHit} />
                    <div id='pause-play' className='player-control-button' onClick={this.buttonClicked} />
                    <div id='next-button' className='player-control-button' onClick={this.nextButtonHit} />
            </div>
        );
    }
}

class Player extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentSong: null,
            currentSongProgressPercentage: 0,
            currentSongProgressString: '00:00'
        };
    }

    playbackChanged(err, currentSong, isPlaying) {

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

                            _react.setState({
                                currentSongProgressString: 'loading'
                            });
                        } else if (event.which == 106) {

                            // seek backwards 30 secs
                            $(this).jPlayer('playHead', 10);
                            _react.setState({
                                currentSongProgressString: 'loading'
                            });
                        } else if (event.which >= 48 && event.which <= 57) {
                            var percent = (event.which - 48) * 10;
                            $(this).jPlayer('playHead', percent);
                            _react.setState({
                                currentSongProgressString: 'loading'
                            });
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
                    } else {
                        var playPauseIcon = $('#pause-play');
                        playPauseIcon.addClass('play');
                    }
                },

                timeupdate: function (event) {
                    var percent = event.jPlayer.status.currentPercentAbsolute;
                    var currentTimeSecs = event.jPlayer.status.currentTime;

                    _react.setState({
                        currentSongProgressPercentage: percent,
                        currentSongProgressString: $.jPlayer.convertTime(currentTimeSecs)
                    });
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
                <div id='current-time'>{this.state.currentSongProgressString}</div>
                <PlayerBar ref={(bar) => this._durationBar = bar} currentProgress={this.state.currentSongProgressPercentage}/>
                <div id='jplayer'></div>
            </div>
        );
    }
}

export default Player;
