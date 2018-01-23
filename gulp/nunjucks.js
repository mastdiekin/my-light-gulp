var gulp           = require('gulp');
var njkRender      = require('gulp-nunjucks-render');
var plumber        = require('gulp-plumber');
var gulpif         = require('gulp-if');
var prettify       = require('gulp-prettify');
var frontMatter    = require('gulp-front-matter');
var config         = require('./config');
var server         = require('./server');
var reportError    = require('./helpers/handle-errors');

gulp.task('nunjucks', function() {
	return gulp.src(config.source.pages +'/**/*.html')
		.pipe(frontMatter({ property: 'data' }).on('error', reportError))
		.pipe(njkRender({
				watch: false,
				trimBlocks: true,
				lstripBlocks: false
			}).on('error', reportError))
		.pipe(prettify({
			indent_size: 1,
			wrap_attributes: 'auto', // 'force'
			preserve_newlines: false,
			indent_char: ' ',
			// unformatted: [],
			end_with_newline: true
		}))
		.pipe(gulp.dest(config.dist.html))
		.pipe(server.reload({stream: true}));
});