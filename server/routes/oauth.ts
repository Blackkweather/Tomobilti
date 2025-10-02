import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { authMiddleware } from '../middleware/auth';
import { db } from '../db';
import { users } from '@shared/sqlite-schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth callback
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await db.select().from(users).where(eq(users.email, email)).get();

    if (!user) {
      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        email: email!,
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        profileImage: picture || null,
        googleId: googleId,
        userType: 'renter' as const,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.insert(users).values(newUser);
      user = newUser;
    } else {
      // Update existing user with Google ID if not set
      if (!user.googleId) {
        await db.update(users)
          .set({ 
            googleId: googleId,
            profileImage: picture || user.profileImage,
            updatedAt: new Date().toISOString()
          })
          .where(eq(users.id, user.id));
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
      message: 'Successfully authenticated with Google'
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Facebook OAuth (mock implementation)
router.post('/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    
    if (!accessToken || !userID) {
      return res.status(400).json({ error: 'Facebook token and user ID are required' });
    }

    // In a real implementation, you would verify the Facebook token
    // For now, we'll create a mock response
    const mockUser = {
      id: userID,
      email: `facebook_${userID}@example.com`,
      name: 'Facebook User',
      picture: null,
    };

    // Check if user exists
    let user = await db.select().from(users).where(eq(users.email, mockUser.email)).get();

    if (!user) {
      const newUser = {
        id: crypto.randomUUID(),
        email: mockUser.email,
        firstName: mockUser.name.split(' ')[0],
        lastName: mockUser.name.split(' ').slice(1).join(' '),
        profileImage: mockUser.picture,
        facebookId: userID,
        userType: 'renter' as const,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.insert(users).values(newUser);
      user = newUser;
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

// GitHub OAuth callback
router.post('/github/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(`GitHub token error: ${tokenData.error_description}`);
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const githubUser = await userResponse.json();

    // Check if user exists
    let user = await db.select().from(users).where(eq(users.email, githubUser.email)).get();

    if (!user) {
      const newUser = {
        id: crypto.randomUUID(),
        email: githubUser.email || `github_${githubUser.id}@example.com`,
        firstName: githubUser.name?.split(' ')[0] || githubUser.login,
        lastName: githubUser.name?.split(' ').slice(1).join(' ') || '',
        profileImage: githubUser.avatar_url,
        githubId: githubUser.id.toString(),
        userType: 'renter' as const,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.insert(users).values(newUser);
      user = newUser;
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
      access_token: tokenData.access_token,
      message: 'Successfully authenticated with GitHub'
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'GitHub authentication failed' });
  }
});

// Apple Sign-In (mock implementation)
router.post('/apple', async (req, res) => {
  try {
    const { identityToken, user } = req.body;
    
    if (!identityToken) {
      return res.status(400).json({ error: 'Apple identity token is required' });
    }

    // In a real implementation, you would verify the Apple token
    const mockUser = {
      id: user?.id || 'apple_user_' + Date.now(),
      email: user?.email || `apple_${Date.now()}@privaterelay.appleid.com`,
      name: user?.name || 'Apple User',
    };

    let dbUser = await db.select().from(users).where(eq(users.email, mockUser.email)).get();

    if (!dbUser) {
      const newUser = {
        id: crypto.randomUUID(),
        email: mockUser.email,
        firstName: mockUser.name.split(' ')[0],
        lastName: mockUser.name.split(' ').slice(1).join(' '),
        profileImage: null,
        appleId: mockUser.id,
        userType: 'renter' as const,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.insert(users).values(newUser);
      dbUser = newUser;
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
