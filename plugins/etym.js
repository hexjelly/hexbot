const request = require('request');
const cheerio = require('cheerio');
const util = require('util');

function parseAndSearch(body, word, modifier) {
	let term;
	let definition;
	const $ = cheerio.load(body);
	if (modifier) {
		const search = `${word.toLowerCase()} (${modifier.toLowerCase()})`;
		// find element that matches word + modifier
		const specificElement = $('.word--C9UPa .word__name--TTbAA').filter((i, el) => {
			return $(el).text() === search;
		}).eq(0);
		term = $(specificElement).text();
		definition = $(specificElement).siblings().eq(0).text();
	} else {
		const firstElement = $('.word--C9UPa .word__name--TTbAA').eq(0);
		term = $(firstElement).text();
		definition = $(firstElement).siblings().eq(0).text();
	}

	if (term && definition) {
		return `${term}: ${definition}`;
	} else {
		return null;
	}
}

function etyHandler(params) {
	const word = params.result[1];
	const to = params.to;
	const modifier = params.result[2];
	const callback = params.callback;
	const url = `http://www.etymonline.com/word/${encodeURIComponent(word)}`;

	request(url, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			let result = parseAndSearch(body, word, modifier);
            if (!result) return console.log('nope');
			else if (result && result.length > 420) {
				result = result.replace(/(?:\r\n|\r|\n)/g, '').substr(0, 416 - url.length) + '... ' + url;
			}
			callback.say(to, result);
		} else if (response.statusCode === 404) {
            callback.say(to, `No results for '${word}'`);
        } else if (error) {
			util.log(error);
		}
	});
}

module.exports = {
  "message": {
    "regex": /^!etym?\s+([^:]+)(?:\s+\:(.+))?$/i,
    "handler": etyHandler
  }
};
