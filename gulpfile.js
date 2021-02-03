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
            baseDir: `${distDir}/`,
            index: 'index.html'
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
    return gulp.src(`${srcDir}/js/**/*.ts`)
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(`${distDir}/js/`))
        .pipe(browserSync.stream())
}
function LoadXML() {
    return gulp.src(`${srcDir}/*.xml`)
        .pipe(gulp.dest(`${distDir}/`))
}
function WatchFiles() {
    gulp.watch(`${srcDir}/pug/**/*.pug`, BuildPug)
    gulp.watch(`${srcDir}/scss/**/*.scss`, BuildScss)
    gulp.watch(`${srcDir}/js/**/*.ts`, BuildJs)
}
function CleanDist() {
    return del([distDir]);
}
// your tasks
gulp.task('clear', CleanDist)
// define complex tasks && export
const build = gulp.series(CleanDist, BuildPug, BuildScss, LoadXML, BuildJs)
const watch = gulp.series(build, gulp.parallel(ReloadBrowser, WatchFiles))
exports.html = BuildPug
exports.css = BuildScss
exports.js = BuildJs
exports.xml = LoadXML
exports.clean = CleanDist
exports.build = build
exports.watch = watch
exports.default = watch
