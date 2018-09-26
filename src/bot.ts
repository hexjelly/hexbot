import 'log-timestamp'; // adds datetimestamp to any console.* calls
import Client from './client';

import { IMDb, Log } from './plugins';

const bot: any = new Client(); // no typings for irc-framework class

bot.use(Log());
bot.use(IMDb());

export default bot;
