var gulp               = require('gulp');
var config             = require('./config');
var iconfont           = require('gulp-iconfont');
var iconfontCss        = require('gulp-iconfont-css');
var notify             = require('gulp-notify');

gulp.task('iconfont', function(){
	gulp.src([config.source.images +'/icons/font/*.svg'])
	.pipe(iconfontCss({
		fontName: config.fontName,
		targetPath: '../'+ config.source.sassRoot +'/helpers/generated/_iconFont.scss',
		fontPath: '../'+ config.source.fontsRoot +'/'
	}))
	.pipe(iconfont({
		fontName: config.fontName,
		prependUnicode: true, // recommended option
		formats: ['ttf', 'eot', 'woff', 'woff2'], // default, 'woff2' and 'svg' are available
	}))
	.on('glyphs', function(glyphs, options) {
		// CSS templating, e.g.
		console.log(glyphs, options);
	})
	.pipe(gulp.dest(config.dist.fonts))
	.pipe(notify({ message: 'Шрифты созданы!', onLast: true }));
});