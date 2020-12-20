# Introduction
This is a simple GroupMe prompt-response style bot. It allows one single Heroku app to run multiple bots.

# Usage
#### Deploy To...
[![Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/amattu2/groupme-bot)

#### Initial Setup
1. Deploy to app (See Above)
2. Create the example GroupMe bot (https://dev.groupme.com/bots)
- The callback URL will be your heroku app endpoint (Eg. `https://my-app.herokuapp.com/example`)
3. Get the bot ID (token) from GroupMe and set it as `example` in the environmental variable config file (Config vars)
4. Restart

#### Creating more bots
1. Clone `/bots/example.js`
2. Change responses `messagePrompts = {}` in the new file
3. Add the new bot to `bots = {}` in `index.js`

- `newbot: require('./bots/newbot.js')`

4. Add the new bot ID from GroupMe as a env variable

- (Eg. `newbot=XYTZEGRG343222D`)

5. Restart the service

#### Bot placeholders
If your bot is based off of `bots/example.js`, the following placeholders text are supported:

`{{user_name}}`
- Replaces the placeholder with the original sender's name and tags them

`{{user_text}}`
- Replaces the placeholder with the original sender's text.

# Notes
From https://github.com/groupme/bot-tutorial-nodejs

# Requirements & Dependencies
N/A
