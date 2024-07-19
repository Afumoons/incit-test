import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByemail, User, NewUser } from '../models/userModel';
import { RowDataPacket } from 'mysql2';


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
        const result = await findUserByemail(email);

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
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).send('Error logging out');
    }
};

export { register, login, logout };
