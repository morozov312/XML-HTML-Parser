'use strict'
// load plugins
const gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create(),
    pug = require('gulp-pug'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
    webpackConfig = require('./webpack.config.js')
// configuring paths
let srcDir = './src',
    distDir = './dist'
// gulp functions
function reloadBrowser() {
    browserSync.init({
        server: {
            baseDir: `${distDir}/`
        },
        port: 3000,
        notify: false
    })
}
function buildPug() {
    return gulp.src(`${srcDir}/pug/*.pug`)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(`${distDir}/`))
        .pipe(browserSync.stream())
}
function buildScss() {
    return gulp.src(`${srcDir}/scss/style.scss`)
        .pipe(scss({ outputStyle: 'expanded' }))
        .pipe(autoprefixer({
            cascade: true,
            overrideBrowserslist: ['last 5 versions']
        }))
        .pipe(gulp.dest(`${distDir}/styles/`))
        .pipe(minifyCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(`${distDir}/styles/`))
        .pipe(browserSync.stream())
}
function buildJs() {
    return gulp.src(`${srcDir}/js/**/*.js`)
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(`${distDir}/js/`))
        .pipe(browserSync.stream())
}
function watchFiles() {
    gulp.watch(`${srcDir}/pug/**/*.pug`, buildPug)
    gulp.watch(`${srcDir}/scss/**/*.scss`, buildScss)
    gulp.watch(`${srcDir}/images/**/*`, loadImages)
    gulp.watch(`${srcDir}/js/**/*.js`, buildJs)
}
function cleanDest() {
    return del([distDir]);
}
// your tasks
gulp.task('clear', cleanDest)
// define complex tasks && export
const build = gulp.series(cleanDest, gulp.parallel(buildPug, buildScss, buildJs))
const watch = gulp.parallel(build, watchFiles, reloadBrowser)
exports.js = buildJs
exports.css = buildScss
exports.html = buildPug
exports.clean = cleanDest
exports.build = build
exports.watch = watch
exports.default = watch
