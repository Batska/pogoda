var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var less = require('gulp-less');
var uniqueFiles = require('gulp-unique-files');

var paths = {
    less: ['./www/src/less/**/*.less'],
    js: ['./www/src/js/app.module.js', '!./www/src/js/bundle.js', './www/src/js/app.config.js', './www/src/js/app.run.js', './www/src/js/components/*.js', './www/src/js/directives/*.js', './www/src/js/services/*.js']
};

gulp.task('default', ['less', 'js', 'connect']);

gulp.task('watch', ['less', 'js', 'connect'], function() {
    gulp.watch(paths.less.concat(paths.js), ['less', 'js']);
});

gulp.task('js', function (done) {
    gulp.src(paths.js)
        .pipe(uniqueFiles())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./www/src/js', {overwrite: true}))
        .on('end', done);
});

gulp.task('less', function (done) {
    gulp.src(paths.less)
        .pipe(uniqueFiles())
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./www/src/css', {overwrite: true}))
        .on('end', done);
});

gulp.task('connect', function() {
    connect.server({
        port: 8888,
        root: './www/',
        livereload: true
    });
});