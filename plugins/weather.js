/* weather plugin, duh */

'use strict';

module.exports = (function () {
  return function init(bot) {
    // extremely naive barebones check of URI as we're passing it to request module anyway
    // basically just checks if anything matches *.* with optional http or https infront and ignores missing : or / characters
    var regex = /^!weather\s+(.+)/i;

    bot.on('message', function(from, to, text) {
      if (to === bot.nick) { // pm instead of channel
        to = from;
      }
      var result = regex.exec(text);
      if (result && result[1]) {
        weather(result[1], bot, to); // thanks to async hell, no idea how to do this better?
      }
    });
  };

  function weather(location, bot, to) {
    var request = require('request');
    var url = "https://query.yahooapis.com/v1/public/yql?q=select%20location%2C%20units%2C%20wind%2C%20atmosphere%2C%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + location + "%22)%20and%20u%3D%22c%22&format=json"

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var weather = JSON.parse(body).query.results.channel;
        var result = weather.location.city + ', ' + weather.location.country + ': ' + weather.item.condition.temp + '°C ' + weather.item.condition.text + ', ' + weather.atmosphere.humidity + '% humidity, ' + weather.wind.chill + '°C ' + weather.wind.speed + 'km/h winds';

        bot.say(to, result);
      }
    });
  };

})();
