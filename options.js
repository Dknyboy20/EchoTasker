var options = {
  appid: "YOUR_APPLICATION_ID",  //Put your application id here found at developer.amazon.com example (amzn1.ask.skill.xxxxxxxxx)
  ARkey: "YOUR_AUTOREMOTE_KEY_HERE", //Put your AutoRemote key here in quotes, find it at your goo.gl/xxxxxx site

  headers: {
      'Content-Type': 'application/json'
  },
  useHttps: false,
  rejectUnauthorized: true,
};

module.exports = options;
