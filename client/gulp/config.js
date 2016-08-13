'use strict';

const config = {

    browserPort: 3000,
    UIPort: 3001,

    scripts: {
        src: './app/js/**/*.js',
        dest: './build/js/'
    },

    images: {
        src: './app/images/**/*.{jpeg,jpg,png,gif,svg}',
        dest: './build/images/'
    },

    local_resources: {
        src: './app/local_resources/**/*.{jpeg,jpg,png,gif,svg,mp3}',
        dest: './build/local_resources/'
    },

    styles: {
        src: './app/styles/**/*.scss',
        dest: './build/css/'
    },

    sourceDir: './app/',

    buildDir: './build/',

    testFiles: './__tests__/**/*.{js,jsx}',

};

export default config;
