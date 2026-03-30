import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import DataLoader from 'dataloader';

import authRoutes from './routes/authRoutes.js';
import { requireAuth, requireRole } from './middleware/authMiddleware.js';

import Event from './models/Event.js';
import Participant from './models/Participant.js';
import User from './models/User.js';

import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ["http://localhost:5173", "https://event-system-psi.vercel.app"],
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'lab5_advanced_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Успішно підключено до MongoDB через Mongoose!'))
    .catch(err => console.error('Помилка підключення до БД:', err));

app.use((req, res, next) => {
    const now = new Date();
    console.log(`[${now.toISOString()}] Отримано запит: ${req.method} ${req.url}`);
    next();
});

app.use('/auth', authRoutes);

app.get('/events', async (req, res) => {
    try {
        let { page = 1, limit = 10, sort = '_id', order = 'asc' } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        
        if (page < 1 || isNaN(page)) return res.status(400).json({ error: "Параметр 'page' має бути числом >= 1." });
        if (limit < 1 || isNaN(limit)) return res.status(400).json({ error: "Параметр 'limit' має бути числом >= 1." });
        
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = { [sort]: sortOrder };
        const skipAmount = (page - 1) * limit;
        
        const events = await Event.find().sort(sortOptions).skip(skipAmount).limit(limit);
        const total = await Event.countDocuments();
        res.json({ total, page, limit, data: events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Помилка сервера при отриманні подій." });
    }
});

app.get('/events/cursor', async (req, res) => {
    try {
        let { lastId, limit = 5 } = req.query;
        limit = parseInt(limit);
        let query = {};
        
        if (lastId) {
            query = { _id: { $gt: lastId } };
        }
        
        const events = await Event.find(query).sort({ _id: 1 }).limit(limit);
        const nextId = events.length > 0 ? events[events.length - 1]._id : null;
        res.json({ data: events, nextId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Помилка сервера при отриманні подій за курсором." });
    }
});

app.post('/events', requireAuth, async (req, res) => {
    try {
        const event = new Event({ ...req.body, creator: req.session.user.id });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/events/:id', requireAuth, async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, creator: req.session.user.id },
            req.body,
            { new: true }
        );
        if (!event) return res.status(403).json({ error: "Доступ заборонено або подію не знайдено" });
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/events/:eventId', requireAuth, async (req, res) => {
    try {
        const { eventId } = req.params;
        
        const query = req.session.user.role === 'Admin' 
            ? { _id: eventId }
            : { _id: eventId, creator: req.session.user.id };

        const event = await Event.findOneAndDelete(query);
        
        if (!event) {
            return res.status(404).json({ message: "Подію не знайдено або недостатньо прав для видалення" });
        }
        
        res.json({ message: "Подію успішно видалено." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Помилка при видаленні події." });
    }
});

app.get('/participants/:eventId', requireAuth, async (req, res) => {
    try {
        const { eventId } = req.params;
        const participants = await Participant.find({ event: eventId }).populate('user', 'email role');
        res.json(participants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Невірний формат ID події або помилка сервера." });
    }
});

app.post('/participants', requireAuth, async (req, res) => {
    try {
        const { eventId } = req.body;
        const participant = new Participant({ user: req.session.user.id, event: eventId });
        await participant.save();
        res.status(201).json(participant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const startApolloServer = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            const participantsLoader = new DataLoader(async (eventIds) => {
                const participants = await Participant.find({ event: { $in: eventIds } }).populate('user');
                return eventIds.map(eventId => 
                    participants.filter(p => p.event.toString() === eventId.toString())
                );
            });

            const userLoader = new DataLoader(async (userIds) => {
                const users = await User.find({ _id: { $in: userIds } });
                const userMap = {};
                users.forEach(user => {
                    userMap[user._id.toString()] = user;
                });
                return userIds.map(userId => userMap[userId.toString()]);
            });

            return { 
                user: req.session.user || null,
                participantsLoader,
                userLoader
            };
        },
    }));

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173", "https://event-system-psi.vercel.app"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Новий користувач підключився до чату');
        
        socket.on('chatMessage', (msg) => {
            io.emit('chatMessage', msg);
        });

        socket.on('disconnect', () => {
            console.log('Користувач відключився');
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`REST API та Socket.io сервер успішно запущено на порту ${PORT}`);
        console.log(`GraphQL доступний за адресою http://localhost:${PORT}/graphql`);
    });
};

startApolloServer();