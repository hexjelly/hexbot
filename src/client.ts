/*
	Extends the Client class from irc-framework with a few additional methods
*/

import { Client as IrcClient } from 'irc-framework';
import Sequelize from 'sequelize';

class Client extends IrcClient {
	public db: Sequelize.Sequelize;

	constructor() {
		super();
		const db_file = process.env.NODE_ENV === "production" ?
			process.env.DB_FILE_PROD :
			process.env.DB_FILE_TEST;
		this.db = new Sequelize('test', '', '', {
			dialect: 'sqlite',
			storage: db_file || 'unknown.db',
			operatorsAliases: false,
			logging: process.env.NODE_ENV != "production" ? console.log : false
		});
	}
}

export default Client;
