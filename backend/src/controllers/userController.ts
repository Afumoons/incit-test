import { Request, Response } from 'express';
import { findAllUsers } from '../models/userModel';

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await findAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
};

export { getAllUsers };
