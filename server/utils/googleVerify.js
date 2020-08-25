const {OAuth2Client} = require('google-auth-library');
const config = require('config');

const googleID = config.get('GOOGLE_CLIENT_ID');

const client = new OAuth2Client(googleID);

async function verify(token) {
  console.log(client);
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleID,
  });

  console.log(ticket);
  const payload = ticket.getPayload();
  console.log(payload);
  return payload;
}

module.exports = verify;
