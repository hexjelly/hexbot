import Bot from './bot';

Bot.connect({
	host: process.env.SERVER,
	port: process.env.PORT,
	nick: process.env.NICK,
	auto_reconnect: true,
	auto_reconnect_wait: 5000,
	auto_reconnect_max_retries: 1000,
	// irc-framework's default max msg length is extremely conservative
	// let's up it to 510 minus a pretty generous command + channel/target length
	message_max_length: 510 - 100
});
