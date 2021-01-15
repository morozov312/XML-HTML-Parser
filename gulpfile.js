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
function ReloadBrowser() {
    browserSync.init({
        server: {
            baseDir: `${distDir}/`
        },
        port: 3000,
        notify: false
    })
}
function BuildPug() {
    return gulp.src(`${srcDir}/pug/*.pug`)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(`${distDir}/`))
        .pipe(browserSync.stream())
}
function BuildScss() {
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
function BuildJs() {
    return gulp.src(`${srcDir}/js/**/*.js`)
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(`${distDir}/js/`))
        .pipe(browserSync.stream())
}
function watchFiles() {
    gulp.watch(`${srcDir}/pug/**/*.pug`, BuildPug)
    gulp.watch(`${srcDir}/scss/**/*.scss`, BuildScss)
    gulp.watch(`${srcDir}/js/**/*.js`, BuildJs)
}
function CleanDist() {
    return del([distDir]);
}
// your tasks
gulp.task('clear', CleanDist)
// define complex tasks && export
const build = gulp.series(CleanDist, gulp.parallel(BuildPug, BuildScss, BuildJs))
const watch = gulp.parallel(build, watchFiles, ReloadBrowser)
exports.js = BuildJs
exports.css = BuildScss
exports.html = BuildPug
exports.clean = CleanDist
exports.build = build
exports.watch = watch
exports.default = watch
