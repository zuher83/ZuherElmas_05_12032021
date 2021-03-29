'use strict';
const ejs = require('gulp-ejs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const minify = require('gulp-clean-css');

function makeTemplate() {
  return gulp.src('./usr/pages/*.html').pipe(ejs()).pipe(gulp.dest('./public'));
}

function scss2css() {
  return gulp
    .src('./assets/scss/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(minify())
    .pipe(gulp.dest('./public/css'));
}

function autoUpdate() {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });

  gulp.watch('./assets/scss/**/*.scss', scss2css);
  gulp.watch('./public/').on('change', browserSync.reload);
  gulp.watch('./usr/**/*.html', makeTemplate);
}

exports.scss2css = scss2css;
exports.watch = autoUpdate;
exports.makeTemplate = makeTemplate;
