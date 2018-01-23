var config             = require('./config');
var server             = require('./server');
var gulp               = require('gulp');
var cache              = require('gulp-cache');
var imagemin           = require('gulp-imagemin');
var pngquant           = require('imagemin-pngquant');
var reportError        = require('./helpers/handle-errors');
var svgmin             = require('gulp-svgmin'); //for svg-sprites
var svgstore           = require('gulp-svgstore'); //for svg-sprites
var Vinyl              = require('vinyl'); //for svg-sprites
var through2           = require('through2'); //for svg-sprites
var cheerio            = require('cheerio'); //for svg-sprites
var consolidate        = require('gulp-consolidate'); //for svg-sprites
var rename             = require('gulp-rename');
var spritesmith        = require("gulp.spritesmith"); //for png-sprites
var gulpif             = require('gulp-if'); //for png-sprites

gulp.task('images', function() {
	return gulp.src([config.source.images +'/**/*', '!'+ config.source.images +'/svg/*.*', '!'+ config.source.images +'/icons/font/**/**.*', '!'+ config.source.images +'/sprites/*.*'])
		.pipe(cache(imagemin([
				// imagemin.gifsicle({interlaced: true}),
				imagemin.jpegtran({progressive: true}),
				imagemin.optipng(),
				imagemin.svgo([{removeViewBox: false}, {minifyStyles: false}])
				], {
					interlaced: true,
					progressive: true,
					use: [pngquant()],
					verbose: true
				}
		).on('error', reportError)))
		.pipe(gulp.dest(config.dist.images));
});

gulp.task('svg-sprites', function () {
	return gulp
		.src(config.source.images +'/svg/*.svg')
		.pipe(svgmin())
		.pipe(svgstore({ 
			inlineSvg: false
		}))
		.pipe(through2.obj(function (file, encoding, cb) {
			var $ = cheerio.load(file.contents.toString(), {xmlMode: true});
			var data = $('svg > symbol').map(function () {
				var $this  = $(this);
				var size   = $this.attr('viewBox').split(' ').splice(2);
				var name   = $this.attr('id');
				var ratio  = size[0] / size[1]; // symbol width / symbol height
				var fill   = $this.find('[fill]:not([fill="currentColor"])').attr('fill');
				var stroke = $this.find('[stroke]').attr('stroke');
				return {
					name: name,
					ratio: +ratio.toFixed(2),
					fill: fill || 'initial',
					stroke: stroke || 'initial'
				};
			}).get();
			this.push(file);
			gulp.src(config.source.sass +'/helpers/generated/_sprite-svg.scss')
				.pipe(consolidate('lodash', {
					symbols: data
				}))
				.pipe(gulp.dest(config.source.sass +'/src/svg'));
			// var jsonFile = new Vinyl({
			//     path: 'metadata.json',
			//     contents: new Buffer(JSON.stringify(data))
			// });
			// this.push(jsonFile);
			cb();
		}))
		.pipe(rename({basename: 'sprite'}))
		.pipe(gulp.dest(config.dist.images +'/svg/dest'));
});

gulp.task('png-sprites', function () {
	var spriteData = gulp.src(config.source.images +'/sprites/*.png')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		use: [pngquant()],
		verbose: true
	})))
	.pipe(spritesmith({
		imgName: 'sprite.png',
		imgPath: '../'+ config.source.imagesRoot +'/sprite.png',
		cssName: '_sprites.sass'
	}));

	return spriteData.pipe(gulpif('*.png', gulp.dest(config.source.images), gulp.dest(config.source.sass+ '/helpers/generated')));
});