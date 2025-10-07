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
    let user = await db.select().from(users).where(eq(users.email, email)).limit(1).then(rows => rows[0] || null);

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

// Facebook OAuth implementation
router.post('/facebook', async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    
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
    const verifyUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${facebookAppId}|${facebookAppSecret}`;
    
    const verifyResponse = await fetch(verifyUrl);
    const verifyData = await verifyResponse.json();
    
    if (!verifyData.data || !verifyData.data.is_valid) {
      return res.status(400).json({ error: 'Invalid Facebook token' });
    }

    // Get user information from Facebook
    const userInfoUrl = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;
    const userResponse = await fetch(userInfoUrl);
    const userData = await userResponse.json();
    
    if (!userData.id) {
      return res.status(400).json({ error: 'Failed to get user information from Facebook' });
    }

    // Check if user exists
    let user = await db.select().from(users).where(eq(users.email, userData.email)).limit(1).then(rows => rows[0] || null);

    if (!user) {
      const newUser = {
        id: crypto.randomUUID(),
        email: userData.email,
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ').slice(1).join(' '),
        profileImage: userData.picture?.data?.url || null,
        facebookId: userData.id,
        userType: 'renter' as const,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.insert(users).values(newUser);
      user = newUser;
    } else {
      // Update existing user with Facebook ID if not set
      if (!user.facebookId) {
        await db.update(users)
          .set({ 
            facebookId: userData.id,
            profileImage: userData.picture?.data?.url || user.profileImage,
            updatedAt: new Date().toISOString()
          })
          .where(eq(users.id, user.id));
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
    const { accessToken } = req.body;
    
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
    let user = await db.select().from(users).where(eq(users.email, mockUser.email)).limit(1).then(rows => rows[0] || null);

    if (!user) {
      const newUser = {
        id: crypto.randomUUID(),
        email: mockUser.email,
        firstName: mockUser.name.split(' ')[0],
        lastName: mockUser.name.split(' ').slice(1).join(' '),
        profileImage: mockUser.picture,
        microsoftId: mockUser.id,
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

    let dbUser = await db.select().from(users).where(eq(users.email, mockUser.email)).limit(1).then(rows => rows[0] || null);

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
