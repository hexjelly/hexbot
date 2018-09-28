/*
	Logs messages and select events to SQLite3 database
*/

import Chalk from 'chalk';

import Log from './models';

function LoggingHandler(command, event, client, next) {
	if (command === 'privmsg') {
		const isChannel = client.network.isChannelName(event.target);
		client.db.models.logs.create({
			event: 'message',
			nick: event.nick,
			ident: event.ident,
			host: event.hostname,
			target: isChannel ? null : event.target,
			channel: isChannel ? event.target : null,
			message: event.message,
		}).catch(error => console.error(Chalk.red(error)));
	}

	next();
}

export function Logging() {
	return function LogMiddleWare(client, _raw_events, parsed_events) {
		client.db.define("logs", Log);
		client.db.sync();

		parsed_events.use(LoggingHandler);
	}
}
