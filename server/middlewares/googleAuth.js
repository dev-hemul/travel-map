import { OAuth2Client } from 'google-auth-library';

const makeClient = () =>
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

// 1) Віддати URL для редіректа на Google
export const getGoogleAuthUrl = (req, res) => {
  const client = makeClient();

  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'consent',
  });

  return res.json({ url });
};

// 2) Обміняти code -> Google user і покласти в req.googleUser
export const googleCodeToUser = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code not provided' });

    const client = makeClient();

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const p = ticket.getPayload();

    req.googleUser = {
      googleId: p.sub,
      email: p.email,
      emailVerified: p.email_verified,
      name: p.name,
      picture: p.picture,
    };

    return next();
  } catch (err) {
    console.error('googleCodeToUser error:', err);
    return res.status(401).json({ message: 'Google auth failed' });
  }
};
