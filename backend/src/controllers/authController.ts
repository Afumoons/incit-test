import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, updateUserLoginInfo, updateUserLogoutInfo, updateUserName, updateUserPassword, findUserByEmail, findUserById, User, NewUser, findUserByVerificationToken } from '../models/userModel';
import { RowDataPacket } from 'mysql2';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import Joi from 'joi';
import sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Passport setup for Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (email) {
            const result = await findUserByEmail(email);
            if (result.length > 0) {
                const user = result[0] as RowDataPacket & User;
                return done(null, user);
            } else {
                const newUser: NewUser = {
                    email,
                    name: profile.displayName,
                    password: '', // No password for OAuth
                    is_verified: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                    logout_at: new Date(),
                };
                await createUser(newUser);
                return done(null, newUser);
            }
        } else {
            return done(null, false, { message: 'No email associated with Google account' });
        }
    } catch (err) {
        return done(err);
    }
}));

// Passport setup for Facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (email) {
            const result = await findUserByEmail(email);
            if (result.length > 0) {
                const user = result[0] as RowDataPacket & User;
                return done(null, user);
            } else {
                const newUser: NewUser = {
                    email,
                    name: profile.displayName,
                    password: '', // No password for OAuth
                    is_verified: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                    logout_at: new Date(),
                };
                await createUser(newUser);
                return done(null, newUser);
            }
        } else {
            return done(null, false, { message: 'No email associated with Facebook account' });
        }
    } catch (err) {
        return done(err);
    }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    // done(null, (user as User).id);
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj as Express.User);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const result = await findUserById(id); // Implement findUserById in your user model
        if (result) {
            const user = result as RowDataPacket & User;
            done(null, user);
        } else {
            done(new Error('User not found'), null);
        }
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth routes
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
export const googleAuthCallback = passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' });

export const googleAuthRedirect = (req: Request, res: Response) => {
    const token = jwt.sign({ userId: (req.user as User).id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    res.redirect('http://localhost:3000/dashboard');
};

// Facebook OAuth routes
export const facebookAuth = passport.authenticate('facebook', { scope: ['email'] });
export const facebookAuthCallback = passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/login' });

export const facebookAuthRedirect = (req: Request, res: Response) => {
    const token = jwt.sign({ userId: (req.user as User).id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    res.redirect('http://localhost:3000/dashboard');
};

// Joi schema for registration validation
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$'))
        .required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords must match' })
});


export const register = async (req: Request, res: Response) => {
    const { email, password, confirmPassword } = req.body;

    // Validate request body against schema
    const { error } = registerSchema.validate({ email, password, confirmPassword });

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: NewUser = {
        email,
        name: '',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        logout_at: new Date(),
        is_verified: false,
        verification_token: uuidv4()
    };

    try {
        await createUser(user);

        // Send verification email
        await sendVerificationEmail(email, user.verificationToken);

        res.status(201).send('User created');
    } catch (err) {
        res.status(500).send('Error creating user');
    }
};

export const sendVerificationEmail = async (email: string, token: string) => {
    const msg = {
        to: email,
        from: 'your-email@example.com', // Your verified sender email
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`,
        html: `<strong>Please verify your email by clicking the following link: <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Verify Email</a></strong>`,
    };

    await sgMail.send(msg);
};

export const verifyEmail = async (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const result = await findUserByVerificationToken(token);

        if (result) {
            const user = result[0] as RowDataPacket & User;

            if (!user) {
                return res.status(400).json({ error: 'Invalid token' });
            }

            user.emailVerified = true;
            user.verificationToken = undefined;
            await user.save();

            res.status(200).json({ message: 'Email verified successfully' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Email verification failed' });
    }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const result = await findUserByEmail(email);

        const user = result[0] as RowDataPacket & User;

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.is_verified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        user.verification_token = uuidv4();
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, user.verification_token);

        res.status(200).json({ message: 'Verification email sent' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to resend verification email' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await findUserByEmail(email);

        if (!Array.isArray(result) || result.length === 0) {
            return res.status(400).send('Invalid credentials');
        }

        const user = result[0] as RowDataPacket & User;

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send('Invalid credentials');
        }

        // Increment login count
        await updateUserLoginInfo(user.id, {
            ...user,
            login_count: (user.login_count || 0) + 1,
            last_login_at: new Date(), // Optionally update the updated_at timestamp
            updated_at: new Date() // Optionally update the updated_at timestamp
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
        });

        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).send('Error logging in');
            }
            res.status(200).json({ token, user });
        });
    } catch (err) {
        res.status(500).send('Error logging in' + err);
    }
};

export const protectedData = async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Ambil data yang dilindungi
    res.status(200).json({ token: req.cookies.token, user: req.user });
};

export const logout = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const result = await findUserByEmail(email);

        const user = result[0] as RowDataPacket & User;
        if (req.user) {
            const user = (req.user as User);
            await updateUserLogoutInfo(user.id, {
                ...user,
                logout_at: new Date(),
                updated_at: new Date() // Optionally update the updated_at timestamp
            });
        } else if (user) {
            await updateUserLogoutInfo(user.id, {
                ...user,
                logout_at: new Date(),
                updated_at: new Date() // Optionally update the updated_at timestamp
            });
        }

        // req.logOut((err) => {
        //     if (err) {
        //         return res.status(500).json({ message: 'Error logging out' });
        //     }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).json({ message: 'Logged out successfully' });
        // });

    } catch (err) {
        res.status(500).send('Error logging out');
    }
};