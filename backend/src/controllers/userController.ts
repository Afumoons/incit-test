import { Request, Response } from 'express';
import { findAllUsers, findUserByEmail, getActiveUsersToday, getAverageActiveUsersLast7Days, getTotalUsers, updateUserName, updateUserPassword, User } from '../models/userModel';
import Joi from 'joi';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await findAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
};

const getTotalUserStatistics = async (req: Request, res: Response) => {
    try {
        const totalUsers = await getTotalUsers();
        const activeUsersToday = await getActiveUsersToday();
        const avgActiveUsersLast7Days = await getAverageActiveUsersLast7Days();

        res.status(200).json({
            totalUsers,
            activeUsersToday,
            avgActiveUsersLast7Days
        });
    } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        res.status(500).send('Error fetching dashboard summary');
    }
};

const getProfileData = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await findUserByEmail(email);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send('Error fetching user data');
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { email, name } = req.body;

    try {
        const result = await findUserByEmail(email);

        const user = result[0] as RowDataPacket & User;
        await updateUserName(user.id, {
            ...user,
            name
        });
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};

// Joi schema for registration validation
const changePasswordSchema = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$'))
        .required(),
});

export const changePassword = async (req: Request, res: Response) => {
    const { email, oldPassword, newPassword } = req.body;

    // Validate request body against schema
    const { error } = changePasswordSchema.validate({ newPassword });

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const result = await findUserByEmail(email);

        const user = result[0] as RowDataPacket & User;
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const password = await bcrypt.hash(newPassword, 10);

        await updateUserPassword(user.id, {
            ...user,
            password
        });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error changing password' });
    }
};

export { getAllUsers, getTotalUserStatistics, getProfileData };
