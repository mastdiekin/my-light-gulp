var gulp   = require('gulp');
var server = require('browser-sync').create();
var util   = require('gulp-util');
var config = require('./config');
var package = require('../package');

gulp.task('server', function() {
	util.log('\n\n\n\n\n\n\n Погнали', util.colors.bgBlue(' GO-GO-GO '), '\n\n\n\n\n\n', util.colors.white.bgRed(' Project: '),util.colors.white.bgCyan(' '+ package.name +' '), '\n\n', util.colors.black.bgWhite(' '+ package.description +' '), '\n\n\n\n\n\n');
	server.init({
		server: {
			// baseDir: !config.production ? [config.dist.root, config.source.root] : config.dist.root,
			baseDir: config.dist.root,
			directory: false,
			serveStaticOptions: {
				extensions: ['html']
			}
		},
		files: [
			config.dist.html + '/*.html',
			config.dist.styles + '/*.css',
			config.dist.images + '/**/*'
		],
		port: util.env.port || 3000,
		logLevel: 'info', // 'debug', 'info', 'silent', 'warn'
		logConnections: false,
		logFileChanges: true,
		open: Boolean(util.env.open),
		notify: false,
		ghostMode: false,
		online: Boolean(util.env.tunnel),
		tunnel: util.env.tunnel || null
	});
});

module.exports = server;
