var options = {
  appid: "amzn1.echo-sdk-ams.app.xxxxxxxxx",  //Put your app id here found at developer.amazon.com
  ARkey: "YOUR_AUTOREMOTE_KEY_HERE", //Put your AutoRemote key here in quotes, find it at your goo.gl/xxxxxx site

  headers: {
      'Content-Type': 'application/json'
  },
  useHttps: true,
  rejectUnauthorized: true,
};

module.exports = options;
