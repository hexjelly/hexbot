/* Retrieve IMDB title, year and rating */

const request = require('request');
const cheerio = require('cheerio');
const util = require('util');

function handler(params) {
  const callback = params.callback;
  const to = params.to;
  if (params.result[1]) {
    searchIMDb(params.result[1], to, callback);
  } else if (params.result[2]) {
    getIMDb(params.result[2], false, to, callback);
  }
}

function getIMDb(tt, link, to, callback) {
  const url = 'http://akas.imdb.com/title/tt' + tt;
  const titleregex = /^(.*)\s(\(.*\))\s-\sIMDb.*$/;

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(body);
      const result = titleregex.exec($('title').text());
      const name = result[1] || 'Unknown';
      const year = result[2] || '(????)';
      const rating = $('span[itemprop=ratingValue]').text() || '?';
      callback.say(to, "[IMDb] " + name + " " + year + " - " + rating + "/10" + (link ? " http://www.imdb.com/title/tt" + tt + "/" : ""));
    } else if (error) {
      util.log(error);
    }
  });
}

function searchIMDb(search, to, callback) {
  const url = "http://www.imdb.com/find?q=" + encodeURIComponent(search) + "&s=tt";

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(body);
      const searchResult = /tt(\d{7})/.exec($('td.result_text a').attr('href'));
      if (searchResult) {
        getIMDb(searchResult[1], true, to, callback);
      } else {
        callback.say(to, "No search results for '" + search + "'.");
      }
    } else if (error) {
      util.log(error);
    }
  });
}

module.exports = {
  "message": {
    "regex": /^!imdb\s(.*)|.*imdb\.com\/title\/tt(\d{7}).*/i,
    "handler": handler
  }
};
