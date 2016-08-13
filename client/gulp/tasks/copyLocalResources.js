'use strict';

import gulp   from 'gulp';
import config from '../config';

gulp.task('copyLocalResources', function () {

    return gulp.src([config.sourceDir + 'local_resources/**/*'])
        .pipe(gulp.dest(config.buildDir + 'local_resources/'));

});
