import Sequelize from 'sequelize';

export default {
	date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	event: Sequelize.ENUM('message', 'join', 'quit', 'kick', 'mode', 'action'),
	network: Sequelize.STRING,
	nick: Sequelize.STRING,
	channel: { type: Sequelize.STRING, allowNull: true },
	target: { type: Sequelize.STRING, allowNull: true },
	message: { type: Sequelize.TEXT, allowNull: true },
	ident: Sequelize.STRING,
	host: Sequelize.STRING,
};
