# Introduction
This is a simple GroupMe prompt-response style bot. It allows one single Heroku app to run multiple bots.

# Usage
#### Initial Setup
1. Deploy to Heroku
2. Create a GroupMe bot (https://dev.groupme.com/bots)
3. Get the BOT ID from GroupMe and set it as `example` in the Heroku variable config (Config vars)
4. Restart

#### Creating more bots
1. Clone `/bots/example.js`
2. Change responses in the new file
3. Add the new bot to `bots` in `index.js`

`newbot: require('./bots/newbot.js')`

4. Add the new bot ID from GroupMe as a env variable

(Eg. `newbot=XYTZEGRG343222D`)

5. Restart

# Notes
From https://github.com/groupme/bot-tutorial-nodejs

# Requirements & Dependencies
N/A
