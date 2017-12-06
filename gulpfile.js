'use strict';

/**
 * Load required plugins
 */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    banner = require('gulp-banner'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    rimraf = require('rimraf');

/**
 * Configuration
 */
var pkg = require('./package.json');
var header = '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    '<%= [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()].join(\'-\') %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= new Date().getFullYear() %> <%= pkg.author %>;' +
    ' Licensed <%= pkg.license %> */\n';

var license =
    '/* ========================================================================' + '\n' +

    '* Extends Bootstrap v3.1.1' + '\n' + '\n' +
    '* Copyright (c) <2014> eBay Software Foundation' + '\n' + '\n' +
    '* All rights reserved.' + '\n' + '\n' +
    '* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:' + '\n' + '\n' +
    '* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.' + '\n' + '\n' +
    '* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.' + '\n' + '\n' +
    '* Neither the name of eBay or any of its subsidiaries or affiliates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.' + '\n' + '\n' +
    '* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.' + '\n' + '\n' +
    '* ======================================================================== */' + '\n';


/**
 * Build styles from SCSS files
 * With error reporting on compiling (so that there's no crash)
 */
gulp.task('styles', function () {
    return gulp.src('src/sass/bootstrap-accessibility.scss')
        .pipe(concat('bootstrap-accessibility.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 2 versions', 'safari 8', 'ie 9', 'ff 28']}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('plugins/css'));
});


/**
 * Build JS
 * With error reporting on compiling (so that there's no crash)
 */
gulp.task('scripts', function () {
    return gulp.src([
        'src/js/functions.js',
        'src/js/alert.js',
        'src/js/tooltip.js',
        'src/js/popover.js',
        'src/js/modal.js',
        'src/js/dropdown.js',
        'src/js/tab.js',
        'src/js/collapse.js',
        'src/js/carousel.js'
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(concat('bootstrap-accessibility.js'))
        .pipe(insert.prepend('\n\n (function($) { \n  "use strict"; \n'))
        .pipe(insert.prepend(license))
        .pipe(insert.append('\n\n })(jQuery);'))
        .pipe(gulp.dest('plugins/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(banner(header, {pkg: pkg}))
        .pipe(gulp.dest('plugins/js'));
});


/**
 * Clean output directories
 */
gulp.task('clean', function (cb) {
    rimraf('plugins', cb);
});


/**
 * Default task build the style guide
 */
gulp.task('default', function (cb) {
    runSequence(
        'clean',
        ['styles', 'scripts'],
        cb
    );
});
