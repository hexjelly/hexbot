import Sequelize from 'sequelize';

export default {
	date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	event: Sequelize.ENUM('message', 'join', 'quit', 'kick', 'mode', 'action'),
	nick: Sequelize.STRING,
	ident: Sequelize.STRING,
	host: Sequelize.STRING,
	target: { type: Sequelize.STRING, allowNull: true },
	channel: { type: Sequelize.STRING, allowNull: true },
	message: { type: Sequelize.TEXT, allowNull: true },
};
