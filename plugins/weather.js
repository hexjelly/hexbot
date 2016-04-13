/* jshint esversion: 6, node: true */
/* weather plugin, duh */

'use strict';

const request = require('request');
const util = require('util');
const nconf = require('nconf');

module.exports = {
  "message": {
    "regex": /^!weather\s+(.+)/i,
    "handler": function (params) {
      let callback = params.callback;
      let to = params.to;
      let location = params.result[1];
      let APIKey = nconf.get('plugins').weather.APIKey;
      let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location) + '&units=metric&appid=' + APIKey;
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let weather = JSON.parse(body);
          // some kind of error
          if (weather.cod != 200) {
            callback.say(to, weather.message);
          } else { // no error, yay probably
            let location = weather.name + ', ' + weather.sys.country;
            let temp = Math.round(weather.main.temp);
            let description = weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1);
            let humidity = weather.main.humidity;
            let wind = Math.round(weather.wind.speed);
            let result = location + ': ' + temp + '°C ' + description + ', ' + humidity + '% humidity, ' + wind + ' m/s winds';
            callback.say(to, result);
          }
        } else {
          util.log(error);
        }
      });
    }
  }
};
