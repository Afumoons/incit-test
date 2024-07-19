import pool from '../utils/db';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id?: number;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    logout_at: Date;
}

interface NewUser {
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    logout_at: Date;
}

const createUser = async (user: NewUser) => {
    const [result] = await pool.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [user.email, user.password]
    );
    return result;
};

const findUserByemail = async (email: string): Promise<User[]> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows;
};

export { createUser, findUserByemail, User, NewUser };
