import React            from 'react';
import $                from 'jquery';
import jPlayer          from 'jplayer';
import PlaybackStore    from '../stores/PlaybackStore';
import PlaybackActions  from '../actions/PlaybackActions';
import Rcslider         from 'rc-slider';

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

        this.state = {
            isUpdating: false,
            progress: 0
        };
    }

    changing(value) {
        this.setState({
            isUpdating: true,
            progress: value
        });
    }

    afterChange(value) {
        this.setState({
            isUpdating: false
        });
        this.props.changedPercentage(value);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.isUpdating) {
            this.setState({
                progress: nextProps.progress
            });
        }
    }

    render() {
        return (
            <div className='player-bar'>
                <Rcslider
                    step={0.1}
                    value={this.state.progress}
                    onChange={this.changing.bind(this)}
                    onAfterChange={this.afterChange.bind(this)}
                />
            </div>
        );
    }
}

class PlayerDurationBar extends React.Component {
    render() {
        return (
            <div id='player-duration-bar'>
                <div id='current-time'>{this.props.progressString}</div>
                <PlayerBar
                    progress={this.props.progress}
                    changedPercentage={this.props.currentProgressChanged} />
                <div id='song-duration'>{this.props.durationString}</div>
            </div>
        );
    }
}

class PlayerVolumeBar extends React.Component {
    render() {
        return (
            <div id='player-volume-bar'>
                <div className='player-volume-left-icon'></div>
                <PlayerBar
                    progress={this.props.volume}
                    changedPercentage={this.props.volumeChanged} />
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
            currentSongProgressString: '00:00',
            currentSongDuration: '00:00',
            currentVolume: 100
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
                    _react.setState({
                        currentSongDuration: $.jPlayer.convertTime(event.jPlayer.status.duration)
                    });
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

    currentProgressChanged(percentage) {
        $('#jplayer').jPlayer('playHead', percentage);
    }

    volumeChanged(value) {
        $('#jplayer').jPlayer('volume', value / 100);
        this.setState({
            currentVolume: value
        });
    }

    render () {
        var songName = null;
        var artistName = null;
        if (this.state.currentSong != null) {
            songName = this.state.currentSong.name;
            artistName = this.state.currentSong.artist;
        }

        return (
            <div id='player'>
                <PlayerControls />
                <PlayerInfo
                    songName={songName}
                    artistName={artistName} />

                <PlayerDurationBar
                    progress={this.state.currentSongProgressPercentage}
                    progressString={this.state.currentSongProgressString}
                    durationString={this.state.currentSongDuration}
                    currentProgressChanged={this.currentProgressChanged} />

                <PlayerVolumeBar
                    volume={this.state.currentVolume}
                    volumeChanged={this.volumeChanged.bind(this)} />


                <div id='jplayer'></div>
            </div>
        );
    }
}

export default Player;
