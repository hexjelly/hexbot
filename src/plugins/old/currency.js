/* jshint esversion: 6, node: true */
/* Currency converter */

'use strict';

const request = require('request');
const util = require('util');

module.exports = {
  "message": {
    "regex": /^!(?:curr|cur|currency)\s+(.+)?([a-z]{3}).*([a-z]{3})$/i,
    "handler": function (params) {
      let amount = parseFloat(params.result[1]) || 1;
      let base = params.result[2];
      let to = params.to;
      let convert = params.result[3];
      let callback = params.callback;
      let url = "https://api.fixer.io/latest?base=" + base.toUpperCase() + "&symbols=" + convert.toUpperCase();

      request(url, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          let currencies = JSON.parse(body);
          if (Object.keys(currencies.rates).length > 0) {
            let conversion = Math.round((amount * currencies.rates[convert.toUpperCase()]) * 100) / 100;
            callback.say(to, amount + " " + base.toUpperCase() + " = " + conversion + " " + convert.toUpperCase());
          } else {
            callback.say(to, "User error");
          }
        } else if (error) {
          util.log(error);
        }
      });
    }
  }
};
