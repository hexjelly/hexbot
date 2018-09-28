import Needle from 'needle';
import Chalk from 'chalk';

/** Formats OMDB API responses, and optionally adds link to the title searched for */
export function formatResponse(json, showLink?) {
	if (json.Response != "True") return "No IMDb information found";

	const title = json.Title || "?";
	const year = json.Year || "????";
	const rating = json.imdbRating || "?";
	const tt = json.imdbID || "???????";
	// this feels dumb, but no idea how else to do this without an unnecessary extra function
	const link = showLink ? ` https://www.imdb.com/title/${tt}/` : "";

	return `[IMDb] ${title} (${year}) ${rating}/10${link}`;
}

export async function getIMDb(tt) {
	const url = `http://www.omdbapi.com/?i=tt${encodeURIComponent(tt)}&apikey=${process.env.OMDB_APIKEY}`;

	const resp = await Needle('get', url);
	return formatResponse(resp.body);
}

export async function searchIMDb(search) {
	const url = `http://www.omdbapi.com/?t=${encodeURIComponent(search)}&apikey=${process.env.OMDB_APIKEY}`;

	const resp = await Needle('get', url);
	return formatResponse(resp.body, true);
}

function IMDbHandler(command, event, client, next) {
	if (!process.env.OMDB_APIKEY) {
		console.warn(Chalk.yellow("[IMDb] Missing OMDB_APIKEY environment variable, skipping middleware"));
		return next();
	}

	if (command === "privmsg" && event.nick != client.user.nick) {
		const pattern = /^!imdb\s(.+)|.*imdb\.com\/title\/tt(\d{7}).*/i;
		const result = pattern.exec(event.message);

		if (!result) return next();

		let msg;
		// matches !imdb command for searching for a title
		if (result[1]) {
			msg = searchIMDb(result[1]);
		} else if (result[2]) { // matches a imdb link for a known title
			msg = getIMDb(result[2]);
		}

		msg.then(msg => client.say(event.target, msg))
			.catch(error => console.error(Chalk.red(error)));
	}

	next();
}

export function IMDb() {
	return function IMDbMiddleWare(_client, _raw_events, parsed_events) {
		parsed_events.use(IMDbHandler);
	}
}
