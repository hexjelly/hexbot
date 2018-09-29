import 'log-timestamp'; // adds datetimestamp to any console.* calls
import Client from './client';

import { IMDb, Logging, LinkTitle, Currency } from './plugins';

const bot: any = new Client(); // no typings for irc-framework class :(

// workaround for irc-framework, where not being able to connect
// the first attempt when running it will make the process quit
bot.connection.connected = true;
bot.connection.registered = true;

// irc-framework's default max msg length is extremely conservative
// let's up it to 510 minus a VERY generous command + channel/target length
bot.options.message_max_length = 510 - 35;

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
bot.use(LinkTitle());

export default bot;
