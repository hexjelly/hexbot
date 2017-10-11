'use strict';

const translate = require('google-translate-api');

module.exports = {
  "message": {
    "regex": /^!tr\s+(?:\:([a-z]{2})\s*)?(?:\:([a-z]{2})\s*)?(.+)$/i,
    "handler": function (params) {
      const result = params.result;
      const from = params.from;
      const to = params.to;
      const fromLang = !result[2] ? null : result[1];
      const toLang = result[2] ? result[2] : (result[1] ? result[1] : 'en');
      const callback = params.callback;
      const translateText = result[3];

      translate(translateText, {from: fromLang, to: toLang}).then(res => {
          callback.say(to, `${from}, [${fromLang ? fromLang : res.from.language.iso} => ${toLang}] ${res.text}`);
      }).catch(err => {
          callback.say(to, `${from}, ${err.message}`);
      });
    }
  }
};
