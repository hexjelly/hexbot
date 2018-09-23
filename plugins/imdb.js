/* Retrieve IMDB title, year and rating */

const request = require('request');
const util = require('util');
const nconf = require('nconf');
const APIKey = nconf.get('plugins').omdb.APIKey;

function handler(params) {
  const callback = params.callback;
  const to = params.to;
  if (params.result[1]) {
    searchIMDb(params.result[1], to, callback);
  } else if (params.result[2]) {
    getIMDb(params.result[2], to, callback);
  }
}

function parseResponse(json, link) {
  if (json.Response === "False") return "No IMDb information found";

  const title = json.Title || "?";
  const year = json.Year || "????";
  const rating = json.Ratings && json.Ratings[0] && json.Ratings[0].Value || "?/10";
  const tt = json.imdbID || "?";

  return "[IMDb] " + title + " " + year + " - " + rating + (link ? " http://www.imdb.com/title/" + tt + "/" : "");
}

function getIMDb(tt, to, callback) {
  const url = "http://www.omdbapi.com/?i=tt" + encodeURIComponent(tt) + "&apikey=" + APIKey;

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body);

      callback.say(to, parseResponse(info, false));
    } else if (error) {
      util.log(error);
    }
  });
}

function searchIMDb(search, to, callback) {
  const url = "http://www.omdbapi.com/?t=" + encodeURIComponent(search) + "&apikey=" + APIKey;

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let info = JSON.parse(body);

      callback.say(to, parseResponse(info, true));
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
