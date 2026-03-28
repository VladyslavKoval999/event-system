import bcrypt from 'bcrypt';
import { getDB } from '../db.js';

export const register = async (req, res) => {
    try {
        const db = getDB();
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email та пароль є обов\'язковими' });
        }

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            password: hashedPassword,
            role: role || 'User'
        };

        await db.collection("users").insertOne(newUser);
        res.status(201).json({ message: 'Користувача створено успішно' });
    } catch (error) {
        console.error("Помилка реєстрації:", error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
};

export const login = async (req, res) => {
    try {
        const db = getDB();
        const { email, password } = req.body;

        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Невірний email або пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Невірний email або пароль' });
        }

        req.session.user = { id: user._id, email: user.email, role: user.role };
        res.json({ message: 'Вхід виконано успішно', user: req.session.user });
    } catch (error) {
        console.error("Помилка входу:", error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Помилка при виході' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Вихід виконано успішно' });
    });
};