import Needle from 'needle';
import Chalk from 'chalk';
import Cheerio from 'cheerio';

export async function getDefinition(word, modifier) {
	const url = `https://www.etymonline.com/word/${encodeURIComponent(word)}`;
	const body = (await Needle('get', url)).body;

	let term;
	let definition;
	let element;
	const $ = Cheerio.load(body);

	if (modifier) {
		const search = `${word.toLowerCase()} (${modifier.toLowerCase()})`;
		// find element that matches word + modifier
		element = $('.word--C9UPa .word__name--TTbAA').filter((_, el) => {
			return $(el).text() === search;
		}).first();
	} else {
		element = $('.word--C9UPa .word__name--TTbAA').first();
	}
	term = $(element).text();
	definition = $(element).siblings('.word__defination--2q7ZH').first().text().replace(/(?:\r|\n|\t|\s{2,})/g, '');

	if (!term || !definition) {
		return `No results for '${word} (${modifier})'`;
	}

	return `${term}: ${definition}`;
}

export function processMessage(message) {
	const pattern = /^!ety(?:m|mology)?\s+([^:]+)(?:\s+\:(.+))?$/i;
	const result = pattern.exec(message);

	if (!result) return false;

	const word = result[1];
	const modifier = result[2];

	return { word, modifier };
}

export function formatMessage(msg, word, max_length) {
	if (msg.length > max_length) {
		const url = `https://etymonline.com/word/${encodeURIComponent(word)}`;
		msg = msg.substr(0, max_length - url.length - 4) + '... ' + url;
	}

	return msg;
}

function EtymologyHandler(command, event, client, next) {
	if (command === "privmsg" && event.nick != client.user.nick) {
		const result = processMessage(event.message);
		if (!result) return next();

		const { word, modifier } = result;
		getDefinition(word, modifier)
			.then(definition => {
				client.say(event.target, formatMessage(definition, word, client.options.message_max_length));
			})
			.catch(error => console.error(Chalk.red(error)));

		return;
	}

	next();
}

export function Etymology() {
	return function EtymologyMiddleWare(_client, _raw_events, parsed_events) {
		parsed_events.use(EtymologyHandler);
	}
}
