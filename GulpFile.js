const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
var sass = require('gulp-sass');


//////////////////////////////////////////////////


function imgMinify() {
    return src('src/pics/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}
exports.img = imgMinify


function copyHtml() {
    return src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'));
}

exports.html = copyHtml



function jsMinify() {
    return src('src/js/**/*.js') 
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/assets/js'));
}
exports.js = jsMinify




var cleanCss = require('gulp-clean-css');
function cssMinify() {
    return src("src/css/**/*.css")
        .pipe(concat('style.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'));

}
exports.css = cssMinify

function sassMinify() {
    return src(["src/sass/**/*.scss", "src/css/**/*.css"])
        .pipe(sass()) 
        .pipe(concat('style.sass.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/assets/css'))
}


function watchTask() {
    watch(['src/js/**/*.js', "src/css/**/*.css"], { interval: 1000 }, parallel(jsMinify, sassMinify));
}

exports.default = series(parallel(imgMinify, jsMinify, sassMinify, copyHtml), watchTask)




