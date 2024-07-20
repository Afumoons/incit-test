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
    id?: number;
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

const updateUser = async (id: number, user: User) => {
    const [result] = await pool.query(
        'UPDATE users SET email = ?, password = ?, updated_at = ?, logout_at = ? WHERE id = ?',
        [user.email, user.password, user.updated_at, user.logout_at, id]
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

export { createUser, findUserByEmail, findUserById, User, NewUser };
