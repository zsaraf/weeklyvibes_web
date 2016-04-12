import React from 'react';
import $ from 'jquery';

class PlayerBlurBar extends React.Component {

    componentDidMount() {
        var _react = this;
        $(window).resize(function () {
            _react.forceUpdate();
        });
    }

    render() {
        var top = $(document).height() - 100;

        return (
            <div id='player-blur-bar'>
                <div id='player-blur-container'>
                    <img />
                </div>
            </div>
        );
    }
}

class BickgroundImage extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.src != this.props.src) {
            var downloadingImage = new Image();
            var _react = this;
            downloadingImage.onload = function () {

                $('#background-img')[0].src = this.src;
                $('#player-blur-container > img')[0].src = this.src;

                _react.recalculateImageSize();
                _react.props.onImageLoaded();

            };

            downloadingImage.src = nextProps.src;
        }
    }

    recalculateImageSize() {
        var image = $('#background-img');
        var playerImage = $('#player-blur-container > img');

        if (image[0].src && image[0].src != '') {

            var imgClass = ($(document).width() / $(document).height() > 1) ? 'wide' : 'tall';
            var oppClass = imgClass == 'wide' ? 'tall' : 'wide';
            if (!image.hasClass(imgClass)) {
                image.addClass(imgClass);
                image.removeClass(oppClass);
                playerImage.addClass(imgClass);
                playerImage.removeClass(oppClass);
                image.css('width', '');
                image.css('height', '');
                playerImage.css('width', '');
                playerImage.css('height', '');
            }

            image.css('left', '0');
            playerImage.css('left', '0');
            playerImage.css('top', ($(document).height() - 100) * -1 + 'px');

            if (image.hasClass('wide')) {

                image.css('width', '100%');
                playerImage.css('width', image.css('width'));

                // Make sure the image is tall enough.
                var docHeight = $(document).height();
                var imgHeight = image.height();

                if (docHeight > imgHeight) {
                    var scaleFactor = docHeight / imgHeight;
                    var imgWidth = image.width() * scaleFactor;
                    var offset = (imgWidth - $(document).width()) / 2;
                    image.css('left', -offset + 'px');
                    playerImage.css('left', -offset + 'px');
                    image.width(imgWidth);
                    playerImage.width(imgWidth);
                }
            } else {

                image.css('height', '100%');
                playerImage.css('height', $(document).height());

                // Make sure the image is wide enough
                var docWidth = $(document).width();
                var imgWidth = image.width();
                var offset = ($(document).width() - imgWidth) / 2;
                image.css('left', offset + 'px');
                playerImage.css('left', offset + 'px');

                if (docWidth > imgWidth) {
                    var scaleFactor = docWidth / imgWidth;
                    var imgHeight = image.height() * scaleFactor;
                    image.height(imgHeight);
                    playerImage.height(imgWidth);
                }
            }
        } else {
            console.log('Image not loaded yet.');
        }
    }

    componentDidMount() {
        $(window).resize(function () {
            this.recalculateImageSize();
        }.bind(this));

        $('#background-img').on('dragstart', function (event) { event.preventDefault(); });
    }

    render () {

        var rectStyle = null;
        if (!this.props.loading) {
            rectStyle = {
                mask: 'url(#mask)',
                fill: this.props.logoColor
            };
        } else {
            rectStyle = {
                mask: 'url(#mask)',
                fill: $('svg > rect').css('fill')
            };
        }

        var alphaStyle = {
            fill: 'white'
        };

        return (
            <div id='bickgroundimage-container' onClick={this.props.onClick}>
                <img id='background-img'/>
                <div id='logo'>
                    <svg width='100%' height='100%'>
                        <defs>
                            <mask id="mask">
                                <rect style={alphaStyle} height='100%' width='100%'/>
                                <text x='50%' y='50%' dy="8px" dx="3px">DAYMIX</text>
                            </mask>
                        </defs>
                        <rect rx='6px' ry='6px' height='100%' width='100%' style={rectStyle}/>
                    </svg>
                </div>
                <PlayerBlurBar />
            </div>
        );
    }
}

export default BickgroundImage;
