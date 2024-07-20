import { Request, Response } from 'express';
import { findAllUsers, getActiveUsersToday, getAverageActiveUsersLast7Days, getTotalUsers } from '../models/userModel';

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

export { getAllUsers, getTotalUserStatistics };
