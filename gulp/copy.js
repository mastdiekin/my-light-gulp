var gulp         = require('gulp');
var config       = require('./config.js');
var cache        = require('gulp-cache');

gulp.task('copy:fonts', function() {
	return gulp
		.src(config.source.fonts + '/**/*.{ttf,eot,woff,woff2}')
		.pipe(gulp.dest(config.dist.fonts));
});

gulp.task('copy:libs', function() {
	return gulp
		.src(config.source.libs + '/**/*.*')
		.pipe(gulp.dest(config.dist.libs));
});

gulp.task('copy:jslibs', function() {
	return gulp
		.src(config.source.js + '/lib/**/*.*')
		.pipe(gulp.dest(config.dist.js + '/lib'));
});

gulp.task('copy', [
	'images',
	'svg-sprites',
	'png-sprites',
	'iconfont',
	'copy:fonts',
	'copy:libs',
	'copy:jslibs'
]);
