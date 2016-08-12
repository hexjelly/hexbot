/* jshint node: true */
/* Get title of pages linked in channel */

'use strict';

const request = require('request');
const cheerio = require('cheerio');
const util = require('util');

function title (params) {
  let result = params.result;
  let to = params.to;
  let callback = params.callback;
  let url = (result[1] != 'www.' ? result[1] + result[2] : 'http://' + result[2]);
  let ignoreRegex = /^(?:.+\.)?([^\/\?]+\.[^\/\?]+)(?:\/|\?)?.*?$/i;
  // because i'm too dumb to figure out some non-manual way to do this ._. ignore sites either handled by other plugins, or has poor titles
  // move this to config file later!
  let ignore = ['youtube.com', 'youtu.be', 'wikipedia.org', 'imdb.com', 'facebook.com', 'recsource.tv', 'janka.la'];
  let host = ignoreRegex.exec(result[2]);

  if (ignore.indexOf(host[1].toLowerCase()) === -1) {
    request({ url: url, method: "HEAD" }, (error, headRes) => {

      // TODO: might be wise to limit a request attempt's size even if checking for content-type first?
      /* var maxSize = 10485760;
      var size = headRes.headers['content-length'];
      if (size > maxSize) {
          // too big
      } else {
        size = 0;
        var res = request({ url: url }, function (err, response, body) {
          // do stuff here
        }).on('data', function (data) { // let's not trust content-length
            size += data.length;
            if (size > maxSize) {
                res.abort();
            }
        }).pipe(file);
      } */

      // only check for title of html files; indexOf because some sites send additional information in content-type header
      if (!error && headRes.headers['content-type'] && headRes.headers['content-type'].indexOf('text/html') > -1) {
        request(url, (error, response, body) => {
          if (!error && response.statusCode == 200) {
            let $ = cheerio.load(body);
            let title = $('title', 'head').text().replace(/(?:\r\n|\r|\n|\s{2,})/g, ''); // remove newlines and multiple space characters
            if (title) {
              callback.say(to, '[Title] ' + title);
            }
          }
        });
      } else {
        util.log(error);
      }
    });
  }
}

module.exports = {
  "message": {
    "regex": /((?:https?\:\/\/)|(?:www\.))(\S+\.\S+)/i,
    "handler": title
  }
};
