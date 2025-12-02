import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { storage } from '../storage';
import jwt from 'jsonwebtoken';
import { sanitizeInput, validateUrl } from '../middleware/sanitize';

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth callback
router.post('/google', async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { accessToken, code } = sanitizedBody;

    console.log('OAuth request received:', { hasAccessToken: !!accessToken, hasCode: !!code });

    let idToken = accessToken;

    // If we received an authorization code, exchange it for tokens
    if (code && !accessToken) {
      console.log('Exchanging authorization code for tokens...');
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: `${req.protocol}://${req.get('host')}/google-callback`,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', errorText);
        return res.status(400).json({ error: 'Failed to exchange code for tokens', details: errorText });
      }

      const tokenData = await tokenResponse.json();
      console.log('Token exchange successful:', { hasIdToken: !!tokenData.id_token, hasAccessToken: !!tokenData.access_token });
      
      idToken = tokenData.id_token;

      if (!idToken) {
        return res.status(400).json({ error: 'No ID token received from Google' });
      }
    }

    if (!idToken) {
      return res.status(400).json({ error: 'Google access token or authorization code is required' });
    }

    console.log('About to verify ID token:', { tokenLength: idToken.length, tokenStart: idToken.substring(0, 20) });

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await storage.getUserByEmail(email!);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create new user
      user = await storage.createUser({
        email: email!,
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        phone: null,
        profileImage: picture || null,
        userType: 'renter',
        password: '', // OAuth users don't need password
      });
      
      // Update with OAuth ID if storage supports it
      if ((user as any).googleId !== undefined) {
        await storage.updateUser(user.id, {
          ...user,
          googleId: googleId,
        } as any);
      }
    } else {
      // Update existing user with Google ID if not set
      if ((user as any).googleId === null || (user as any).googleId === undefined) {
        await storage.updateUser(user.id, {
          ...user,
          googleId: googleId,
          profileImage: picture || user.profileImage,
        } as any);
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        userType: user.userType,
        isVerified: user.isVerified,
      },
      token: jwtToken,
      isNewUser,
      message: 'Successfully authenticated with Google'
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Facebook OAuth implementation
router.post('/facebook', async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { accessToken, userID } = sanitizedBody;
    
    if (!accessToken || !userID) {
      return res.status(400).json({ error: 'Facebook token and user ID are required' });
    }

    // Verify the Facebook token with Facebook's API
    const facebookAppId = process.env.FACEBOOK_APP_ID;
    const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
    
    if (!facebookAppId || !facebookAppSecret) {
      return res.status(500).json({ error: 'Facebook OAuth not configured' });
    }

    // Verify the access token with Facebook
    const verifyUrl = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(facebookAppId)}|${encodeURIComponent(facebookAppSecret)}`;
    
    if (!validateUrl(verifyUrl)) {
      return res.status(400).json({ error: 'Invalid verification URL' });
    }
    
    const verifyResponse = await fetch(verifyUrl);
    
    if (!verifyResponse.ok) {
      console.error('Facebook token verification failed:', verifyResponse.status, verifyResponse.statusText);
      return res.status(400).json({ error: 'Failed to verify Facebook token' });
    }
    
    const verifyData = await verifyResponse.json();
    
    if (!verifyData.data || !verifyData.data.is_valid) {
      console.error('Facebook token verification data:', verifyData);
      return res.status(400).json({ error: 'Invalid Facebook token' });
    }

    // Get user information from Facebook
    const userInfoUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`;
    
    if (!validateUrl(userInfoUrl)) {
      return res.status(400).json({ error: 'Invalid user info URL' });
    }
    
    const userResponse = await fetch(userInfoUrl);
    
    if (!userResponse.ok) {
      console.error('Facebook user info request failed:', userResponse.status, userResponse.statusText);
      return res.status(400).json({ error: 'Failed to get user information from Facebook' });
    }
    
    const userData = await userResponse.json();
    
    if (!userData.id) {
      console.error('Facebook user data:', userData);
      return res.status(400).json({ error: 'Failed to get user information from Facebook' });
    }

    // Check if user exists
    let user = await storage.getUserByEmail(userData.email);

    if (!user) {
      user = await storage.createUser({
        email: userData.email,
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ').slice(1).join(' '),
        phone: null,
        profileImage: userData.picture?.data?.url || null,
        userType: 'renter',
        password: '', // OAuth users don't need password
      });
      
      // Update with Facebook ID if storage supports it
      if ((user as any).facebookId !== undefined) {
        await storage.updateUser(user.id, {
          ...user,
          facebookId: userData.id,
        } as any);
      }
    } else {
      // Update existing user with Facebook ID if not set
      if ((user as any).facebookId === null || (user as any).facebookId === undefined) {
        await storage.updateUser(user.id, {
          ...user,
          facebookId: userData.id,
          profileImage: userData.picture?.data?.url || user.profileImage,
        } as any);
      }
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        userType: user.userType,
        isVerified: user.isVerified,
      },
      token: jwtToken,
      message: 'Successfully authenticated with Facebook'
    });

  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.status(500).json({ error: 'Facebook authentication failed' });
  }
});

// Microsoft OAuth (for UK users who prefer Microsoft accounts)
router.post('/microsoft', async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { accessToken } = sanitizedBody;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Microsoft access token is required' });
    }

    // In a real implementation, you would verify the Microsoft token
    // For now, we'll create a mock response
    const mockUser = {
      id: 'microsoft_user_' + Date.now(),
      email: `microsoft_${Date.now()}@outlook.com`,
      name: 'Microsoft User',
      picture: null,
    };

    // Check if user exists
    let user = await storage.getUserByEmail(mockUser.email);

    if (!user) {
      user = await storage.createUser({
        email: mockUser.email,
        firstName: mockUser.name.split(' ')[0],
        lastName: mockUser.name.split(' ').slice(1).join(' '),
        phone: null,
        profileImage: mockUser.picture,
        userType: 'renter',
        password: '', // OAuth users don't need password
      });
      
      // Update with Microsoft ID (using githubId field) if storage supports it
      if ((user as any).githubId !== undefined) {
        await storage.updateUser(user.id, {
          ...user,
          githubId: mockUser.id,
        } as any);
      }
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        userType: user.userType,
        isVerified: user.isVerified,
      },
      token: jwtToken,
      message: 'Successfully authenticated with Microsoft'
    });

  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    res.status(500).json({ error: 'Microsoft authentication failed' });
  }
});

// Apple Sign-In (mock implementation)
router.post('/apple', async (req, res) => {
  try {
    const sanitizedBody = sanitizeInput(req.body);
    const { identityToken, user } = sanitizedBody;
    
    if (!identityToken) {
      return res.status(400).json({ error: 'Apple identity token is required' });
    }

    // In a real implementation, you would verify the Apple token
    const mockUser = {
      id: user?.id || 'apple_user_' + Date.now(),
      email: user?.email || `apple_${Date.now()}@privaterelay.appleid.com`,
      name: user?.name || 'Apple User',
    };

    let dbUser = await storage.getUserByEmail(mockUser.email);

    if (!dbUser) {
      dbUser = await storage.createUser({
        email: mockUser.email,
        firstName: mockUser.name.split(' ')[0],
        lastName: mockUser.name.split(' ').slice(1).join(' '),
        phone: null,
        profileImage: null,
        userType: 'renter',
        password: '', // OAuth users don't need password
      });
      
      // Update with Apple ID if storage supports it
      if ((dbUser as any).appleId !== undefined) {
        await storage.updateUser(dbUser.id, {
          ...dbUser,
          appleId: mockUser.id,
        } as any);
      }
    }

    const jwtToken = jwt.sign(
      { userId: dbUser.id, email: dbUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImage: dbUser.profileImage,
        userType: dbUser.userType,
        isVerified: dbUser.isVerified,
      },
      token: jwtToken,
      message: 'Successfully authenticated with Apple'
    });

  } catch (error) {
    console.error('Apple OAuth error:', error);
    res.status(500).json({ error: 'Apple authentication failed' });
  }
});

export default router;
