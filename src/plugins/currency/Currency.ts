import Needle from 'needle';
import Chalk from 'chalk';

export async function getRates(from, to, amount) {
	const url = `https://api.exchangeratesapi.io/latest?symbols=${to}&base=${from}`;
	const response = await Needle('get', url);
	if (response.statusCode != 200) return `Error connecting to currency site, status code: ${response.statusCode}`;
	if (response.body.error) return response.body.error;
	return amount * response.body.rates[to];
}

export function processMessage(message) {
	const pattern = /^!(?:curr?|currency)\s+(.+)?\b([a-z]{3})\b.*\b([a-z]{3})\b/i;
	const result = pattern.exec(message);

	if (!result) return false;

	// amazing API requires uppercase symbols
	const from = result[2].toUpperCase();
	const to = result[3].toUpperCase();
	const amount = Number(result[1]) || 1;

	return { from, to, amount };
}

function CurrencyHandler(command, event, client, next) {
	if (command === "privmsg" && event.nick != client.user.nick) {
		const result = processMessage(event.message);
		if (!result) return next();

		const { from, to, amount } = result;
		getRates(from, to, amount)
			.then(value => {
				if (typeof value === 'number') {
					client.say(event.target, `${amount.toFixed(2)} ${from} = ${value.toFixed(2)} ${to}`);
				}
				else if (typeof value === 'string') client.say(event.target, value);
			})
			.catch(error => console.error(Chalk.red(error)));
	}

	next();
}

export function Currency() {
	return function CurrencyMiddleWare(_client, _raw_events, parsed_events) {
		parsed_events.use(CurrencyHandler);
	}
}
