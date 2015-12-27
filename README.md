# hexbot
Because I want an inferior node.js IRC bot to call my own.

Loosely based on code from [zoidbox](https://github.com/atuttle/zoidbox). You might want to use that one, or any of the other node.js IRC bots on Github, as this is a bit of learning project.

# Config
All settings can be set through the config/config.default.json file, or alternatively you can add your own config/config.user.json file which will override the default config options. This file is also set to be ignored in git if you want private settings while forking etc.

# Plugins
There's a very naïve implementation of plugins. Just copy the general syntax of any of the existing ones and put it in the plugins/ folder.
You can forego some node.js modules if you don't plan to use certain plugins:

Plugin  | Node modules
------------- | -------------
calc.js  | mathjs
elma_wrs.js  | request, cheerio
etym.js | request, cheerio
imdb.js | request, cheerio
isup.js  | request
translate.js  | request
weather.js  | request
wikipedia.js | request
youtube.js | request

## calc.js
**![c|calc] expression**

Uses the excellent [mathjs](http://mathjs.org/) module, so it supports a broad array of expression syntax which is just passed to the mathjs module's .eval method.

## elma_wrs.js
**!wr [0]1-54**

Most likely of no use to anyone else. Fetches the current world record of one of the 54 internal Elasto Mania levels from [Moposite's WR page](http://www.moposite.com/records_elma_wrs.php).

## etym.js
**!ety[m] word [:(v|n|adj|etc)]**

Gets etymology information for word/term from http://www.etymonline.com/.

## imdb.js
**Passive listener**

Gets the IMDb title, year and rating for any IMDb links in channel.

**!imdb title**

Uses the extremely simple IMDb search and displays the first result in the same format as the passive listener, and adds a link to it.

## isup.js
**!isup [http|https][://][subdomain]domain.tld**

Really basic function utilizing the request module and just checking for a 200 response code from the site. Simple support for mangled urls.

## translate.js
**!tr [:en] [:jp] translation text**

Uses the [Yandex](https://www.yandex.com/) translation API. If only supplied one language code, it will try to use auto-detection to get the original language. If no language codes are specified, it will try to auto-detech and translate to English.
Important to note that you need to add your own API key for this plugin. You can set this in the config file. Make sure **not** to put it in the default config file if you plan to fork the repo.

## weather.js
**!weather city|country**

Uses the [Yahoo weather API](https://weather.yahoo.com/). No API key needed.

## wikipedia.js
**!wik[i] search**

Uses the Wikipedia API. No API key needed.

## youtube.js
**Passive listener**

Gets the Youtube title and duration for links in channel. Requires Youtube API v3 key.

**!youtube|!yt search**

Gives the first search result for a query and display it like the passive listener. Requires Youtube API v3 key.
