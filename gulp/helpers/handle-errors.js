var notify = require('gulp-notify');

module.exports = function() {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: 'Compile Error',
		message: '<%= error.message %>',
		sound: 'Submarine'
	}).apply(this, args);
	this.emit('end');
};

function onError(err) {
	console.log(err);
	this.emit('end');
}

var reportError = function (error) {
	var line = (error.line) ? 'LINE ' + error.line + ' -- ' : '';

	notify({
		title: 'Провал таска [' + error.plugin + ']',
		message: line + 'Посмотри консоль.',
		sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).write(error);

	gutil.beep(); // Beep 'sosumi' again

	// Inspect the error object
	//console.log(error);

	// Easy error reporting
	//console.log(error.toString());

	// Pretty error reporting
	var report = '';
	var chalk = gutil.colors.white.bgRed;

	report += chalk('TASK:') + ' [' + error.plugin + ']\n';
	report += chalk('PROB:') + ' ' + error.message + '\n';
	if (error.line) { report += chalk('LINE:') + ' ' + error.line + '\n'; }
	if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
	console.error(report);

	// Prevent the 'watch' task from stopping
	this.emit('end');
}