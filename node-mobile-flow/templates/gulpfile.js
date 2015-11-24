/// <binding BeforeBuild='pre-build' ProjectOpened='watch, serve' />
var gulp = require('gulp'),
    fs = require('fs'),
    exec = require('child_process').exec;

gulp.task('html', function () {
    var include = require('gulp-html-tag-include'),
        htmlmin = require('gulp-htmlmin');
    return gulp.src(['src/**/*.html', '!src/partials/**/*.html', '!src/**/*.partial.html'])
        .pipe(include({
        tagName: 'iframe'
    })).pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true
    })).pipe(gulp.dest('www'));
});

gulp.task('less', function () {
    var less = require('gulp-less'),
        css = require('gulp-minify-css'),
        concat = require('gulp-concat-css');
    return gulp.src('src/**/*.less')
        .pipe(less())
        .pipe(concat('appBundle.css', {
        rebaseUrls: false
    })).pipe(css()).pipe(gulp.dest('www/appBundle'));
});

gulp.task('script', function () {
    var ts = require('gulp-typescript'),
        uglify = require('gulp-uglify');
    return gulp.src('src/**/*.ts')
        .pipe(ts({
        out: 'appBundle.js'
    })).pipe(uglify()).pipe(gulp.dest('www/appBundle'));
});

gulp.task('bower', function () {
    var bower = require('main-bower-files');
    return gulp.src(bower(), { base: 'src/bower' }).pipe(gulp.dest('www/bower'));
});

gulp.task('watch', ['html', 'less', 'script', 'bower'], function () {
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*.less', ['less']);
    gulp.watch('src/**/*.ts', ['script']);
    gulp.watch('bower/**/*', ['bower']);
});

gulp.task('serve', function () {
    var phonegap = require('phonegap');
    phonegap.serve({
        port: 8000,
        autoreload: true,
        browser: true,
        localtunnel: false
    }, function (e, server) {
        if (!e) console.log('PhoneGap server has started.');
        else process.exit(1);
    });
});

gulp.task('pre-build', ['html', 'less', 'script', 'bower']);