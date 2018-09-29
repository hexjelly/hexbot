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

/** 
	as we're not able to rely on all/any irc servers to echo our msg,
	we'll inject a utility function on the client class that lets other
	plugins log their messages transparently.
	
	TODO: maybe find a less "hacky" way?
*/
function LogInject(client) {
	const oldSay = client.say;
	client.say = function injectedSay(dest, message) {
		const isChannel = client.network.isChannelName(dest);
		client.db.models.logs.create({
			event: 'message',
			nick: client.user.nick,
			ident: client.user.username,
			host: client.user.host,
			target: isChannel ? null : dest,
			channel: isChannel ? dest : null,
			message: message,
		}).catch(error => console.error(Chalk.red(error)));
		return oldSay.apply(client, arguments);
	}
}

export function Logging() {
	return function LogMiddleWare(client, _raw_events, parsed_events) {
		client.db.define("logs", Log);
		client.db.sync();

		LogInject(client);

		parsed_events.use(LoggingHandler);
	}
}
