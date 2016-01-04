/* Check if website is up */

'use strict';

var request = require('request');

module.exports = {
  "message": {
    "regex": /^!isup\s+(?:https|http)?(?:\:|\/)*(.+\..+)/i,
    "handler": function (params) {
      var result = params.result;
      var callback = params.callback;
      var testURI = 'http://' + result[1];

      request(testURI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          callback(testURI + ' seems to be up!');
        } else {
          callback(testURI + ' is down for me as well');
        }
      });
    }
  }
}
