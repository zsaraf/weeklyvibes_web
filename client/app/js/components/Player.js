import React from 'react';
import $ from 'jquery';
import jPlayer from 'jplayer';

class PlayerInfo extends React.Component {

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
            <div id='player-info'>
                <div id='artist-name'>{this.props.artistName}</div>
                <div id='song-name'>{this.props.songName}</div>
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
                <div id='current-time'>00:00</div>
                <div id='outer-bar'>
                    <div id='inner-bar' />
                </div>
            </div>
        );
    }
}

class PlayerControls extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='player-controls'>
                <div id='back-button'></div>
                <div id='pause-play'></div>
                <div id='forward-button'></div>
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
        return;
        if (nextProps.loading == false) {
            $('#jplayer').jPlayer('play');
        } else {
            $('#jplayer').jPlayer('pause');
        }

        if (!this.props.dayMix || ((this.props.dayMix && nextProps.daymix) && (this.props.dayMix.forDate != nextProps.dayMix.forDate))) {
            var dayMix = nextProps.dayMix;
            var _react = this;

            if ($('#jplayer').data().jPlayer) {
                $('#jplayer').jPlayer('setMedia', {
                    title: dayMix.title,
                    mp3: dayMix.mixSrc
                });
            }

            $('#jplayer').jPlayer({
                ready: function () {
                    $(this).jPlayer('setMedia', {
                        title: dayMix.title,
                        mp3: dayMix.mixSrc
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
                },

                loadeddata: function (event) {
                    $('#duration').html($.jPlayer.convertTime(event.jPlayer.status.duration));
                },

                play: function (event) {
                    var playPauseIcon = $('#play-pause-icon');
                    playPauseIcon.removeClass();
                    playPauseIcon.addClass('pause');
                },

                pause: function (event) {
                    var playPauseIcon = $('#play-pause-icon');
                    playPauseIcon.removeClass();
                    playPauseIcon.addClass('play');
                },

                progress: function (event) {
                    // console.log('progress: ' + event.jPlayer.status.seekPercent);
                },

                timeupdate: function (event) {
                    var currentTimeSecs = event.jPlayer.status.currentTime;
                    $('#current-time').html($.jPlayer.convertTime(currentTimeSecs));
                },

                supplied: 'mp3'
            });
        }
    }

    render () {
        // console.log(this.props.dayMix);
        var title = null;
        var artist = null;
        var link = null;
        var playerInfo = null;
        if (this.props.dayMix) {
            title = (
                <div id='title'>{this.props.dayMix.title}</div>
            );

            artist = (
                <div id='artist'>{this.props.dayMix.artist}</div>
            );

            var linkText = 'music';
            if (this.props.dayMix.mixLink.indexOf('soundcloud') > -1) {
                linkText = 'soundcloud';
            }

            var imageText = 'image';
            if (this.props.dayMix.imgLink.indexOf('flickr') > -1) {
                imageText = 'flickr';
            } else if (this.props.dayMix.imgLink.indexOf('interfacelift') > -1) {
                imageText = 'ifl';
            }

            link = (
                <div id='links'>
                    <a target='_blank' id='mix-link' className={linkText} href={this.props.dayMix.mixLink}>
                        {linkText}
                    </a>
                    &nbsp;&middot;&nbsp;
                    <a target='_blank' id='img-link' className={imageText} href={this.props.dayMix.imgLink}>
                        {imageText}
                    </a>
                </div>
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
