import 'log-timestamp'; // adds datetimestamp to any console.* calls
import Client from './client';

import { IMDb, Logging, LinkTitle } from './plugins';

const bot: any = new Client(); // no typings for irc-framework class :(

bot.use(Logging());
bot.use(IMDb());
bot.use(LinkTitle());

export default bot;
