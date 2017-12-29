var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');

gulp.task('Task1', function () {
    console.log('Tâche 1');
});

gulp.task('sass', function () {
    return gulp.src('public/assets/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/assets'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    return gulp.watch('public/assets/scss/*.scss', ['sass']);
    return gulp.watch('public/assets/views/*.html', browserSync.reload({ stream: true }));
    return gulp.watch('public/assets/**/*.html', browserSync.reload);
});

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'public'
        }
    })
});

gulp.task('useref', function () {
    var assets = useref.assets();
    return gulp.src('public/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'))
});