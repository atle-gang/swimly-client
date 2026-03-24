// routes/userRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
import { prisma } from '../client';

config();

interface RegisterBody {
  name: string;
  surname: string;
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

interface ResetPasswordBody {
  email: string;
  newPassword: string;
}

interface AuthTokenPayload {
  user: {
    id: string;
    username?: string;
    email?: string;
  };
}

const router = Router();

router.post(
  '/register',
  async (req: Request<{}, any, RegisterBody>, res: Response, next: NextFunction) => {
    try {
      const { name, surname, username, email, password } = req.body;

      const genSalt = await bcryptjs.genSalt();
      const hash = await bcryptjs.hash(password, genSalt);

      const newUser = await prisma.$primary().user.create({
        data: {
          name,
          surname,
          username,
          email,
          password: hash,
          balance: {
            create: {},
          },
        }
      });

      const userId = newUser.user_id;
      const payload: AuthTokenPayload = {
        user: { id: userId, username, email },
      };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(201).json({
        message: `User with email ${email} successfully created`,
        name,
        surname,
        username,
        email,
        userId,
        authToken,
        expiresIn: 3600000,
        expiresAt: Date.now() + 3600000,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/login',
  async (req: Request<{}, any, LoginBody>, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const existingUser = await prisma.$replica().user.findUnique({ where: { email } });

      if (!existingUser) {
        return res.status(404).json({ message: 'User does not exist' });
      }

      const result = await bcryptjs.compare(password, existingUser.password);

      if (!result) {
        return res.status(401).json({ message: 'Wrong password' });
      }

      const userId = existingUser.user_id;
      const payload: AuthTokenPayload = {
        user: { id: userId, username: existingUser.username, email },
      };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(200).json({
        message: `User with email ${email} successfully logged in`,
        name: existingUser.name,
        surname: existingUser.surname,
        username: existingUser.username,
        email,
        userId,
        authToken,
        expiresIn: 3600000,
        expiresAt: Date.now() + 3600000,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/change-password',
  async (req: Request<{}, any, ChangePasswordBody>, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header('Authorization');
      const token = authHeader!.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
      const userId = decoded.user.id;

      const currentUser = await prisma.$replica().user.findUnique({ where: { user_id: userId } });

      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { currentPassword, newPassword } = req.body;
      const result = await bcryptjs.compare(currentPassword, currentUser.password);

      if (!result) {
        return res.status(401).json({ message: 'Password does not match' });
      }

      const genSalt = await bcryptjs.genSalt();
      const newHash = await bcryptjs.hash(newPassword, genSalt);

      const updatedUser = await prisma.$primary().user.update({
        where: { user_id: userId },
        data: { password: newHash },
      });

      const payload: AuthTokenPayload = { user: { id: updatedUser.user_id } };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(200).json({
        message: 'Password changed successfully',
        authToken,
        username: updatedUser.username,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/reset-password',
  async (req: Request<{}, any, ResetPasswordBody>, res: Response, next: NextFunction) => {
    try {
      const { email, newPassword } = req.body;

      const existingUser = await prisma.$replica().user.findUnique({ where: { email } });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const genSalt = await bcryptjs.genSalt();
      const newHash = await bcryptjs.hash(newPassword, genSalt);

      const updatedUser = await prisma.$primary().user.update({
        where: { email },
        data: { password: newHash },
      });

      const payload: AuthTokenPayload = { user: { id: updatedUser.user_id, email } };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

      return res.status(200).json({
        message: 'Password reset successfully',
        authToken,
        email,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete('/delete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
    const userId = decoded.user.id; // adjust according to your payload structure

    // 3. Delete user (cascade will handle balance & transactions)
    await prisma.$primary().user.delete({ where: { user_id: userId } });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next(error);
  }
});

export { router as userRoutes };