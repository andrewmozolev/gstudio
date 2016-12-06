'use strict';

const gulp         = require('gulp');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const browserSync  = require('browser-sync').create();
const del          = require('del');
const stylus       = require('gulp-stylus');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const flexboxfixer = require('postcss-flexboxfixer');
const mqpacker     = require('css-mqpacker');
const cssnano      = require('cssnano');
const rename       = require('gulp-rename');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const uglify       = require('gulp-uglify');
const fs           = require('fs');
const webpack      = require('webpack-stream');
const svgSprite    = require('gulp-svg-sprite');
const argv         = require('minimist')(process.argv.slice(2));
const path         = require('path');
const gulpIf       = require('gulp-if');

let isOnProduction = !!argv.production;
let buildPath      = isOnProduction ? 'build' : 'tmp';
let srcPath        = 'src/';



/* ===========================
=            HTML            =
=========================== */

gulp.task('html', function() {
  return gulp.src('**/*.html', {cwd: path.join(srcPath)})
    .pipe(plumber({
      errorHandler: notify.onError({
        message: 'Error: <%= error.message %>',
        sound: 'notwork'
      })
    }))
    .pipe(gulp.dest(buildPath))
    .pipe(notify({
      message: 'Html complite: <%= file.relative %>!',
      sound: 'Pop'
    }));
});

/* =====  End of HTML  ====== */





/* =============================
=            STYLE             =
============================= */

gulp.task('style', function() {
  return gulp.src('style.styl', {cwd: path.join(srcPath, 'stylus/')})
  .pipe(plumber({
    errorHandler: notify.onError({
      message: 'Error: <%= error.message %>',
      sound: 'notwork'
    })
  }))
  .pipe(stylus({
    'include css': true
  }))
  .pipe(postcss([
    flexboxfixer,
    autoprefixer({browsers: ['last 2 version']}),
    mqpacker,
    cssnano({safe:true})
    ]))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest(buildPath + '/css'))
  .pipe(notify({
    message:'Style complite: <%= file.relative %>!',
    sound: 'Pop'
  }));
});

/* =====  End of STYLE  ====== */





/* ===========================
=            IMG             =
=========================== */

gulp.task('img', function() {
  return gulp.src(['**/*.*', '!svg-sprite/*.*'], {cwd: path.join(srcPath, 'img'), since: gulp.lastRun('img')})
  .pipe(gulpIf(isOnProduction, imagemin({
    progressive: true,
    svgoPlugins: [
    {removeViewBox: false},
    {cleanupIDs: false}
    ],
    use: [pngquant()]
  })))

  .pipe(gulp.dest(buildPath + '/img'));
});

/* =====  End of IMG  ====== */





/*=======================================
=              SVG-SPRITE               =
=======================================*/

gulp.task('svg', function() {
  return gulp.src('**/*.svg', {cwd: path.join(srcPath, 'img/svg-sprite')})
  .pipe(svgSprite({
    mode: {
      symbol: {
        dest: '.',
        dimensions: '%s',
        sprite: buildPath + '/img/svg-sprite.svg',
        example: false,
        render: {css: {dest: 'src/stylus/_global/svg-sprite.css'}}
      }
    },
    svg: {
      xmlDeclaration: false,
      doctypeDeclaration: false
    }
  }))
  .pipe(gulp.dest('./'));
});

/*========  End of SVG-SPRITE  ========*/





/* ===============================
=            WEBPACK             =
============================== */

gulp.task('webpack', function() {
  return gulp.src('script.js', {cwd: path.join(srcPath, 'js')})
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(webpack())
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest(buildPath + '/js'))
    .pipe(notify({
      message:'JS complite: <%= file.relative %>!',
      sound: 'Pop'
    }));
});

/* =====  End of WEBPACK  ====== */





/* ==================================
=               FONTS               =
================================== */

gulp.task('fonts', function() {
  return gulp.src('**/*.*', {cwd: path.join(srcPath, 'fonts')})
  .pipe(gulp.dest(buildPath + '/fonts'));
});

/* =======  End of FONTS  ======== */





/* =============================
=            CLEAN             =
============================= */

gulp.task('clean', function() {
  return del([path.join(buildPath), path.join(srcPath, 'stylus/_global/svg-sprite.css')]).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

/* =====  End of CLEAN  ====== */





/* ==============================
=            SERVER             =
============================== */

gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: buildPath
    },
    notify: false,
    open: false,
    ui: false
  });
  browserSync.watch(buildPath + '/**/*.*').on('change', browserSync.reload);
});

/* =====  End of SERVER  ====== */





/* =============================
=            BUILD             =
============================= */

gulp.task('build', gulp.series('clean','svg',gulp.parallel('html','fonts','style','img','webpack')));

/* =====  End of BUILD  ====== */





/* =============================
=            WATCH             =
============================= */

gulp.task('watch', function() {
  gulp.watch('**/*.html', {cwd: path.join(srcPath)}, gulp.series('html'));
  gulp.watch('**/*.*', {cwd: path.join(srcPath, 'fonts')}, gulp.series('fonts'));
  gulp.watch('**/*.styl', {cwd: path.join(srcPath, 'stylus')}, gulp.series('style'));
  gulp.watch(['!svg-sprite/*.*','**/*.*'], {cwd: path.join(srcPath, 'img')}, gulp.series('img'));
  gulp.watch('**/*.svg', {cwd: path.join(srcPath, 'img/svg-sprite')}, gulp.series('svg','style'));
  gulp.watch('**/*.js', {cwd: path.join(srcPath, 'js')}, gulp.series('webpack'));
});

/* =====  End of WATCH  ====== */





/* ===============================
=            DEFAULT             =
=============================== */

gulp.task('default', gulp.series('build', gulp.parallel('watch','server')));

/* =====  End of DEFAULT  ====== */


