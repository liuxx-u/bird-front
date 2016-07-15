export default (gulp) => {
    gulp.task('assets', function() {
        return gulp.src('./index.html').pipe(gulp.dest('./dist'));
    });
};
