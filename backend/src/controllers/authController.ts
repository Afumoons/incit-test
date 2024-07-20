import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById, User, NewUser } from '../models/userModel';
import { RowDataPacket } from 'mysql2';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';

dotenv.config();

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
                    password: '', // No password for OAuth
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

// // Passport setup for Facebook strategy
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_CLIENT_ID!,
//     clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//     callbackURL: '/api/auth/facebook/callback',
//     profileFields: ['id', 'emails', 'name']
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const email = profile.emails?.[0].value;
//         if (email) {
//             const result = await findUserByEmail(email);
//             if (result.length > 0) {
//                 const user = result[0] as RowDataPacket & User;
//                 return done(null, user);
//             } else {
//                 const newUser: NewUser = {
//                     email,
//                     password: '', // No password for OAuth
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                     logout_at: new Date(),
//                 };
//                 await createUser(newUser);
//                 return done(null, newUser);
//             }
//         } else {
//             return done(null, false, { message: 'No email associated with Facebook account' });
//         }
//     } catch (err) {
//         return done(err);
//     }
// }));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, (user as User).id);
});

// passport.deserializeUser((obj, done) => {
//     done(null, obj as Express.User);
// });
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
const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/' });

const googleAuthRedirect = (req: Request, res: Response) => {
    const token = jwt.sign({ userId: (req.user as User).id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

    res.redirect('http://localhost:3000/dashboard');
};

// // Facebook OAuth routes
// const facebookAuth = passport.authenticate('facebook', { scope: ['email'] });
// const facebookAuthCallback = passport.authenticate('facebook', { failureRedirect: '/' });

// const facebookAuthRedirect = (req: Request, res: Response) => {
//     const token = jwt.sign({ userId: (req.user as User).id }, process.env.JWT_SECRET!, {
//         expiresIn: '1h',
//     });

//     res.cookie('token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//     });

//     res.redirect('/dashboard');
// };

const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: NewUser = {
        email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        logout_at: new Date(),
    };

    try {
        await createUser(user);
        res.status(201).send('User created');
    } catch (err) {
        res.status(500).send('Error creating user');
    }
};

const login = async (req: Request, res: Response) => {
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

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
};

const logout = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
        });

        // // Optionally, update the logout_at timestamp in the database
        // await updateUser(user.id, { ...user, logout_at: new Date() });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).send('Error logging out');
    }
};

export {
    register,
    login,
    logout,
    googleAuth,
    googleAuthCallback,
    googleAuthRedirect,
    // facebookAuth,
    // facebookAuthCallback,
    // facebookAuthRedirect
};
