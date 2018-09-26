import Bot from './bot';

Bot.connect({
	host: process.env.SERVER,
	port: process.env.PORT,
	nick: process.env.NICK
});
