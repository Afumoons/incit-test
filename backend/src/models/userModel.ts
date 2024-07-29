import pool from '../utils/db';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password: string;
    is_verified: boolean;
    verification_token: string;
    created_at: Date;
    updated_at: Date;
    login_count: number;
    last_login_at: Date;
    logout_at: Date;
}

interface NewUser extends Omit<User, 'id' | 'login_count'> {
    login_count?: number;
}

const createUser = async (user: NewUser) => {
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password, is_verified, created_at) VALUES (?, ?, ?, ?, NOW())',
        [user.name, user.email, user.password, user.is_verified, user.created_at]
    );
    return result;
};

const findUserByEmail = async (email: string): Promise<User[]> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows;
};

const findUserById = async (id: number | string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
    );
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
};

const findUserByVerificationToken = async (token: string): Promise<User | null> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users WHERE verification_token = ?',
        [token]
    );
    if (rows.length > 0) {
        return rows[0];
    }
    return null;
};

export const findAllUsers = async (): Promise<User[]> => {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows as User[];
};

const updateUserLoginInfo = async (id: number, user: User) => {
    const [result] = await pool.query(
        'UPDATE users SET login_count = ?, last_login_at = ?, updated_at = ? WHERE id = ?',
        [user.login_count, user.last_login_at, user.updated_at, id]
    );
    return result;
};

const updateUserLogoutInfo = async (id: number, user: User) => {
    const [result] = await pool.query(
        'UPDATE users SET logout_at = ?, updated_at = ? WHERE id = ?',
        [user.logout_at, user.updated_at, id]
    );
    return result;
};

const updateUserName = async (id: number, user: User) => {
    const [result] = await pool.query(
        'UPDATE users SET name = ? WHERE id = ?',
        [user.name, id]
    );
    return result;
};

const updateUserPassword = async (id: number, user: User) => {
    const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [user.password, id]
    );
    return result;
};

const deleteUser = async (id: number) => {
    const [result] = await pool.query(
        'DELETE FROM users WHERE id = ?',
        [id]
    );
    return result;
};

const getAllUsers = async (): Promise<User[]> => {
    const [rows] = await pool.query<User[]>(
        'SELECT * FROM users'
    );
    return rows;
};

// Get total number of users
const getTotalUsers = async (): Promise<number> => {
    const query = 'SELECT COUNT(*) as count FROM users';
    const [rows] = await pool.execute(query);
    const result = rows as RowDataPacket[];
    return result[0].count;
};

// Get total number of users with active sessions today
const getActiveUsersToday = async (): Promise<number> => {
    const query = 'SELECT COUNT(*) as count FROM users WHERE DATE(updated_at) = CURDATE()';
    const [rows] = await pool.execute(query);
    const result = rows as RowDataPacket[];
    return result[0].count;
};

// Get average number of active session users in the last 7 days
const getAverageActiveUsersLast7Days = async (): Promise<number> => {
    const query = `
        SELECT AVG(daily_count) as avg_count FROM (
            SELECT COUNT(*) as daily_count 
            FROM users 
            WHERE updated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(updated_at)
        ) as daily_counts`;
    const [rows] = await pool.execute(query);
    const result = rows as RowDataPacket[];
    return result[0].avg_count;
};

export { createUser, updateUserLoginInfo, updateUserLogoutInfo, updateUserName, updateUserPassword, findUserByEmail, findUserById, findUserByVerificationToken, getTotalUsers, getActiveUsersToday, getAverageActiveUsersLast7Days, User, NewUser };
