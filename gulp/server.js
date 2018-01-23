var gulp   = require('gulp');
var server = require('browser-sync').create();
var util   = require('gulp-util');
var config = require('./config');

gulp.task('server', function() {
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
