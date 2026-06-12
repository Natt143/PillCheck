// app.config.js
const appJson = require('./app.json');

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra || {}),
      collectApiKey: process.env.COLLECT_API_KEY,
    },
  },
};