var util = require('gulp-util');

var production = util.env.production || util.env.prod || false;
var distPath = 'dist';
var config = {

	env              : 'development',
	production       : production,

	source: {
		root         : 'app',
		pages        : 'app/pages',
		sass         : 'app/sass',
		fonts        : 'app/fonts',
		js           : 'app/js',
		images       : 'app/images',
		imagesRoot   : 'images',
		svg          : 'app/images/svg',
		libs         : 'app/libs'
	},
	dist: {
		root         : distPath,
		html         : distPath,
		styles       : distPath + '/styles',
		js           : distPath + '/js',
		images       : distPath + '/images',
		fonts        : distPath + '/fonts',
		libs         : distPath + '/libs'
	},

	setEnv: function(env) {
		if (typeof env !== 'string') return;
		this.env = env;
		this.production = env === 'production';
		process.env.NODE_ENV = env;
	},

	logEnv: function() {
		util.log(
			'Environment:',
			util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
		);
	},

	errorHandler: require('./helpers/handle-errors')
}

config.setEnv(production ? 'production' : 'development');

module.exports = config;