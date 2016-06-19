// Preloader: Taken from:
const ImagePreloader = {

    preload(imgs, callback) {
        'use strict';
        var loaded = 0;
        var images = [];
        imgs = Object.prototype.toString.apply(imgs) === '[object Array]' ? imgs : [imgs];

        var inc = () => {
            loaded += 1;
            if (loaded === imgs.length && callback) {
                callback(images);
            }
        };

        for (var i = 0; i < imgs.length; i++) {
            images[i] = new Image();
            images[i].onabort = inc;
            images[i].onerror = inc;
            images[i].onload = inc;
            images[i].src = imgs[i];
        }
    },
};

export default ImagePreloader;
