import express from 'express';
import 'dotenv/config'

const port = process.env.EXPRESS_PORT;
const applicationID = process.env.GITLAB_CLIENT_ID;
const applicationSecret = process.env.GITLAB_CLIENT_SECRET;
const host = process.env.GITLAB_HOST_URL;
if (!port) {
  throw new Error('EXPRESS_PORT is not set');
}
if (!applicationID) {
  throw new Error('GITLAB_CLIENT_ID is not set');
}
if (!applicationSecret) {
  throw new Error('GITLAB_CLIENT_SECRET is not set');
}
if (!host) {
  throw new Error('GITLAB_HOST_URL is not set');
}

const callbackURL = `http://localhost:${port}/oauth-callback/`;
const gitLabAuthURL = `${host}/oauth/authorize`;


console.log('EXPRESS_PORT: ' + process.env.EXPRESS_PORT)
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/auth/gitlab', (req, res) => {
  const authURL = `${gitLabAuthURL}?client_id=${applicationID}&redirect_uri=${callbackURL}&response_type=code&scope=read_user%20read_api`;
  res.redirect(authURL);
});

app.get('/oauth-callback', async (req, res) => {
  const { code } = req.query;
  console.log('code:', code)

  try {
    const tokenResponse = await fetch(`${host}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: applicationID,
        client_secret: applicationSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: callbackURL,
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;
    console.log('tokenData:', tokenData)
    console.log('accessToken:', accessToken)
    console.log('refreshToken:', refreshToken)
    console.log('expiresIn:', expiresIn)
    // Here you can use the access token to make authenticated requests to GitLab
    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error exchanging code for token', error);
    res.status(500).send('Authentication failed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});