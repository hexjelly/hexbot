/* Currency convertern */

'use strict';

function init (bot) {
  var regex = /^!(?:curr|cur|currency)\s+(.+)?([a-z]{3}).*([a-z]{3})$/i;

  bot.on('message', function(from, to, text) {
    var result = regex.exec(text);
    if (result) {
      currency(result[1], result[2], result[3], to);
    }
  });

  function currency (amount, base, convert, to) {
    var request = require('request');
    var amount = parseFloat(amount) || 1;
    var url = "https://api.fixer.io/latest?base=" + base.toUpperCase() + "&symbols=" + convert.toUpperCase() ;

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var currencies = JSON.parse(body);
        if (Object.keys(currencies.rates).length > 0) {
          bot.say(to, amount + " " + base.toUpperCase() + " = " + (amount * currencies.rates[convert.toUpperCase()]) + " " + convert.toUpperCase());
        } else {
          bot.say(to, "User error");
        }
      }
    });
  };
};

module.exports = init;
