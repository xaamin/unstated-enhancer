export default (_console: any) => {
    "use strict";

	const f  = () => {};

	// these all do nothing if they aren't defined:
	if (!_console.log) {
        _console.log = f;
    }
	if (!_console.profile) {
        _console.profile = f;
    }
	if (!_console.profileEnd) {
        _console.profileEnd = f;
    }
	if (!_console.timeStamp) {
        _console.timeStamp = f;
    }
	if (!_console.trace) {
        _console.trace = f;
    }

	// these all alias to console.log if they aren't defined:
	if (!_console.debug) {
        _console.debug = _console.log;
    } // identical to console.log
	if (!_console.info) {
        _console.info = _console.log;
    } // identical to console.log
	if (!_console.warn) {
        _console.warn = _console.log;
    }
	if (!_console.error) {
        _console.error = _console.log;
    }
	if (!_console.dir) {
        _console.dir = _console.log;
    }
	if (!_console.dirxml) {
        _console.dirxml = _console.dir;
    }

    return _console;
}