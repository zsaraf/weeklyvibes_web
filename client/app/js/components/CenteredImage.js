'use strict';

import React from 'react';
import $ from 'jquery';

class CenteredImage extends React.Component{

    constructor(props) {
        super(props);
    }

    recalculateImageSize() {

        var selector = '.centered-image#i' + this.props.id + ' > img';
        var image = $(selector);
        var holder = image.parent();

        if (image[0].src && image[0].src != '') {

            var imgClass = (holder.width() / holder.height() > 1) ? 'wide' : 'tall';
            var oppClass = imgClass == 'wide' ? 'tall' : 'wide';
            if (!image.hasClass(imgClass)) {
                image.addClass(imgClass);
                image.removeClass(oppClass);
                image.css('width', '');
                image.css('height', '');
            }

            image.css('left', '0');

            if (image.hasClass('wide')) {

                image.css('width', '100%');

                // Make sure the image is tall enough.
                var holderHeight = holder.height();
                var imgHeight = image.height();

                if (holderHeight > imgHeight) {
                    var scaleFactor = holderHeight / imgHeight;
                    var imgWidth = image.width() * scaleFactor;
                    var offset = (imgWidth - holder.width()) / 2;
                    image.css('left', -offset + 'px');
                    image.width(imgWidth);
                }
            } else {

                image.css('height', '100%');

                // Make sure the image is wide enough
                var holderWidth = holder.width();
                var imgWidth = image.width();

                if (holderWidth > imgWidth) {
                    var scaleFactor = holderWidth / imgWidth;
                    var imgHeight = image.height() * scaleFactor;
                    image.height(imgHeight);
                } else {
                    var offset = (holder.width() - imgWidth) / 2;
                    image.css('left', offset + 'px');
                }
            }
        } else {
            console.log('Image not loaded yet.');
        }
    }

    componentDidMount() {

        var downloadingImage = new Image();
        var _react = this;
        downloadingImage.onload = function () {
            var selector = '.centered-image#i' + _react.props.id + ' > img';
            $(selector)[0].src = this.src;

            _react.recalculateImageSize();

            // _react.props.onImageLoaded();

        };

        downloadingImage.src = this.props.imgSrc;
    }

    render() {
        return (
            <div className='centered-image' id={'i' + this.props.id}>
                <img />
            </div>
        );
    }

}

export default CenteredImage;
