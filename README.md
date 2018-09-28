# Hexbot
[![Build Status](https://travis-ci.org/hexjelly/hexbot.svg?branch=master)](https://travis-ci.org/hexjelly/hexbot) [![Coverage Status](https://coveralls.io/repos/github/hexjelly/hexbot/badge.svg?branch=master)](https://coveralls.io/github/hexjelly/hexbot?branch=master)

A personal IRC bot written in TypeScript. Uses the [irc-framework](https://github.com/kiwiirc/irc-framework) module as a base, with various plugins implemented as middleware. Probably not very useful to anyone else, but maybe it can serve as an example of how to write a very basic bot, along with features or plugins.

## Usage

1. Either create a `.env` file or set environment variables:
```bash
SERVER=localhost
PORT=6667
NICK=hexbot
DB_FILE=bot.db
OMDB_APIKEY=
```

2. `npm i`
3. `npm run build`
4. `npm run start`
