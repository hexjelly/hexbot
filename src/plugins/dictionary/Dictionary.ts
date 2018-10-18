import Needle from 'needle';
import Chalk from 'chalk';

export async function getDefinition(word) {
	const url = `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/definitions?limit=5&includeRelated=false&sourceDictionaries=wiktionary%2Cwebster&useCanonical=true&includeTags=false&api_key=${process.env.WORDNIK_APIKEY}`;
	const response = await Needle('get', url);
	if (response.statusCode != 200) throw new Error(`Error connecting to WordNik API, status code: ${response.statusCode}`);

	if (!Array.isArray(response.body) || response.body.length == 0) {
		return `Couldn't find definition for '${word}'.`;
	}

	const definition = response.body.reduce((acc, curr, idx) => {
		return `${acc} ${idx + 1}: ${curr.text}`;
	}, `${response.body[0].word} -`);

	return definition;
}

export function formatMessage(msg, max_length) {
	if (msg.length > max_length) {
		msg = msg.substr(0, max_length - 3) + '...';
	}

	return msg;
}

export async function processMessage(message) {
	const pattern = /^!(?:dict|define|def|dic)\s+(.*)$/i;
	const result = pattern.exec(message);

	if (!result) return false;

	return await getDefinition(result[1]);
}

function DictionaryHandler(command, event, client, next) {
	if (command === "privmsg" && event.nick != client.user.nick) {
		processMessage(event.message).then(result => {
			if (!result) return next();
			client.say(event.target, formatMessage(result, client.options.message_max_length));
		})
			.catch(error => console.error(Chalk.red(`[Dictionary] ${error}`)));
	} else {
		return next();
	}
}

export function Dictionary() {
	return function DictionaryMiddleWare(_client, _raw_events, parsed_events) {
		if (!process.env.WORDNIK_APIKEY) {
			return console.warn(Chalk.yellow("[Dictionary] Missing WORDNIK_APIKEY environment variable, skipping middleware"));
		}
		parsed_events.use(DictionaryHandler);
	}
}
