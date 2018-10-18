import 'log-timestamp'; // adds datetimestamp to any console.* calls
import Client from './client';

import { IMDb, Logging, LinkTitle, Currency, Etymology, ElmaWRs, YouTube, Dictionary } from './plugins';

const bot: any = new Client(); // no typings for irc-framework class :(

// workaround for irc-framework, where not being able to connect
// the first attempt when running it will make the process quit
bot.connection.connected = true;
bot.connection.registered = true;

bot.on('registered', () => {
	const channels = process.env.CHANNELS ? process.env.CHANNELS.split(',') : [];
	channels.forEach(channel => {
		bot.join('#' + channel);
	});
});

// bot.on('debug', event =>	console.log(event));
// bot.on('raw', event => console.log(event));

bot.use(Logging());
bot.use(IMDb());
bot.use(Currency());
bot.use(Etymology());
bot.use(YouTube());
bot.use(Dictionary());
bot.use(LinkTitle());
bot.use(ElmaWRs());

export default bot;
