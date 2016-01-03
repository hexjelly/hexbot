/* Currency convertern */

'use strict';

function init (bot) {
  var regex = /^!(?:curr|cur|currency)\s+(.+)?([a-z]{3}).*([a-z]{3})$/i;

  bot.on('message', function (from, to, text) {
    var result = regex.exec(text);
    if (result) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      }
      currency(result[1], result[2], result[3], function (result) {
        bot.say(to, result);
      });
    }
  });

  function currency (amount, base, convert, callback) {
    var request = require('request');
    var amount = parseFloat(amount) || 1;
    var url = "https://api.fixer.io/latest?base=" + base.toUpperCase() + "&symbols=" + convert.toUpperCase() ;

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var currencies = JSON.parse(body);
        if (Object.keys(currencies.rates).length > 0) {
          var conversion = Math.round((amount * currencies.rates[convert.toUpperCase()]) * 100) / 100;
          callback(amount + " " + base.toUpperCase() + " = " + conversion + " " + convert.toUpperCase());
        } else {
          callback("User error");
        }
      }
    });
  };
};

module.exports = init;
