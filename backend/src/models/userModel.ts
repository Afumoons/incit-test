import pool from '../utils/db';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password: string;
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
        'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
        [user.name, user.email, user.password, user.created_at]
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

export { createUser, updateUserLoginInfo, updateUserLogoutInfo, findUserByEmail, findUserById, User, NewUser };
