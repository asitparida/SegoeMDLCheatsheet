var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    del = require('del');

var errorHandler = function (error) {
    console.log(error);
    this.emit('end');
}

var resolveMinifiedPath = function (path) {
    var params = path.split("/");
    var file = params.splice(params.length - 1, 1)[0];
    var newPath = params.join("/") + "/";

    return {
        file: file,
        path: newPath
    };
}

// Clean the distributable css directory
gulp.task('minify:clean:css', function () {
    return del('dist/css/');
});

// Compile out sass files and minify it
gulp.task('minify:css', ['minify:clean:css'], function () {
    var min = resolveMinifiedPath("./dist/segoe-icons.min.css");
    return gulp.src('dist/segoe-icons.scss')
        .pipe(plumber(errorHandler))
        .pipe(sass())
        .pipe(gulp.dest('dist/css/'))
        .pipe(cssmin())
        .pipe(concat(min.file))
        .pipe(gulp.dest(min.path));
});

//Watch CSS task
gulp.task('default:segoe-crawl:css', function () {
    gulp.watch('dist/segoe-icons.scss', ['minify:css']);
});