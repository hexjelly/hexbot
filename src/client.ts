/*
	Extends the Client class from irc-framework with a few additional methods
*/

import { Client as IrcClient } from 'irc-framework';
import SQLite from 'better-sqlite3';

class Client extends IrcClient {
	public db: SQLite;

	constructor() {
		super();
		this.db = new SQLite(process.env.DB_FILE || "bot.db");
	}
}

export default Client;
