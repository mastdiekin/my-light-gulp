var config             = require('./config');
var server             = require('./server');
var gulp               = require('gulp');
var sass               = require('gulp-sass');
var wait               = require('gulp-wait');
var reportError        = require('./helpers/handle-errors');
var bourbon            = require('node-bourbon');
var postcss            = require('gulp-postcss');
var mqpacker           = require('css-mqpacker');
var autoprefixer       = require('gulp-autoprefixer');
var concat             = require('gulp-concat');
var rename             = require('gulp-rename');
var cssnano            = require('gulp-cssnano');
var csso               = require('postcss-csso');

//Сортировка медиа запросов
function isMax(mq) {
	return /max-width/.test(mq);
}

function isMin(mq) {
	return /min-width/.test(mq);
}

function sortMediaQueries(a, b) {
	A = a.replace(/\D/g, '');
	B = b.replace(/\D/g, '');

	if (isMax(a) && isMax(b)) {
		return B - A;
	} else if (isMin(a) && isMin(b)) {
		return A - B;
	} else if (isMax(a) && isMin(b)) {
		return 1;
	} else if (isMin(a) && isMax(b)) {
		return -1;
	}

	return 1;
}

gulp.task('sass', function(){
	return gulp.src([config.source.sass + '/**/*.{sass,scss}','!'+ config.source.sass + '/**/bootstrap-theme.{sass,scss}', '!'+ config.source.sass + '/lib/_bootstrap-variables.{sass,scss}'])
		// .pipe(wait(50))
		.pipe(sass.sync({
			outputStyle: config.production ? 'compact' : 'expanded',
			includePaths: require('node-bourbon').with(config.source.sass)
		}).on('error', reportError))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(postcss([
			mqpacker({
				sort: sortMediaQueries
			}),
			csso
		]).on('error', reportError))
		.pipe(gulp.dest(config.dist.styles))
		.pipe(server.reload({stream: true}));
});

gulp.task('bootstrap', function(){
	return gulp.src([config.source.sass + '/**/bootstrap-theme.{sass,scss}', config.source.sass + '/lib/_bootstrap-variables.{sass,scss}'])
		.pipe(wait(50))
		.pipe(sass.sync({
			includePaths: require('node-bourbon').with(config.source.sass)
		}).on('error', reportError))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(postcss([
			mqpacker({
				sort: sortMediaQueries
			})
		]).on('error', reportError))
		.pipe(concat('bootstrap.css'))
		.pipe(cssnano({
			reduceIdents: false
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.dist.styles +'/lib/'))
		.pipe(server.reload({stream: true}));
});