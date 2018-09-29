import Bot from './bot';

// workaround for irc-framework, where not being able to connect
// the first attempt when running it will make the process quit
Bot.connection.connected = true;
Bot.connection.registered = true;

Bot.connect({
	host: process.env.SERVER,
	port: process.env.PORT,
	nick: process.env.NICK,
	auto_reconnect: true,
	auto_reconnect_wait: 5000,
	auto_reconnect_max_retries: 1000
});

Bot.on('registered', () => {
	const channels = process.env.CHANNELS ? process.env.CHANNELS.split(',') : [];
	channels.forEach(channel => {
		Bot.join('#' + channel);
	});
});

// Bot.on('debug', function (event) {
// 	console.log(event);
// });
