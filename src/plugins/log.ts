/*
	Logs messages and select events to SQLite3 database
*/

import { inspect } from 'util';

function LogHandler(command, event, client, next) {
	if (command === "privmsg") {
	}

	next();
}



export function Log() {
	return function LogMiddleWare(_client, _raw_events, parsed_events) {
		parsed_events.use(LogHandler);
	}
}
