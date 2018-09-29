import Needle from 'needle';
import Chalk from 'chalk';
import Cheerio from 'cheerio';

export async function getPage(url) {
	/*
	check header for text/html first
	a "better" way would be to use the stream version of Needle, and call destroy()
	on the stream after header event if they aren't what we want, but it's a bit complicated.
	we'll just make two requests because lazy.
	*/
	const content_type = (await Needle('head', url, null, { follow_max: 2 })).headers["content-type"];

	if (!content_type || !content_type.toLowerCase().includes("text/html")) {
		return false;
	}

	return (await Needle('get', url, null, { follow_max: 2 })).body;
}

export function processMessage(message) {
	/* 
	too convoluted to match every valid tld and check for false positives with
	single periods, so this will only check for urls with http(s) or www. prefixes
	*/
	const pattern = /((?:https?:\/\/(?:www\.)?|www\.))(\S+\.\S+)/i;
	const result = pattern.exec(message);
	if (!result) return false;
	/*
	in lieu of creating an overly complicated and possibly slow regex that handles everything,
	we'll just check if we matched an url without protocol prefix and add it ourselves.
	*/
	const url = (result[1] != 'www.' ? result[1] + result[2] : 'http://www.' + result[2]);
	return url;
}

export function processPage(html) {
	const $ = Cheerio.load(html);
	// return first title tag found, and remove newlines and multiple space characters
	return $('title').first().text().replace(/(?:\r|\n|\s{2,})/g, ' ');
}

async function getTitle(message) {
	const url = processMessage(message);
	if (!url) return false;
	const html = await getPage(url);
	if (!html) return false;
	return processPage(html);
}

function LinkTitleHandler(command, event, client, next) {
	if (command != "privmsg" || event.nick == client.user.nick) {
		return next();
	}

	getTitle(event.message)
		.then(title => {
			if (title) client.say(event.target, "[Title] " + title)
		})
		.catch(error => console.error(Chalk.red(error)));

	next();
}

export function LinkTitle() {
	return function IMDbMiddleWare(_client, _raw_events, parsed_events) {
		parsed_events.use(LinkTitleHandler);
	}
}
