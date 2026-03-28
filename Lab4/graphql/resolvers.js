import Event from '../models/Event.js';
import Participant from '../models/Participant.js';
import User from '../models/User.js';

export const resolvers = {
  Query: {
    getEvents: async (_, { limit = 10, skip = 0, title }) => {
      const query = title ? { title: { $regex: title, $options: 'i' } } : {};
      return await Event.find(query).skip(skip).limit(limit);
    }
  },
  
  Mutation: {
    addEvent: async (_, { input }, context) => {
      if (!context.user) {
        throw new Error('Неавторизований доступ. Увійдіть у систему.');
      }
      
      if (!input.title || input.title.trim().length < 3) {
         throw new Error('Помилка валідації: Назва події має містити щонайменше 3 символи.');
      }

      const userId = context.user.id || context.user._id;

      const event = new Event({ ...input, creator: userId });
      return await event.save();
    }
  },

  Event: {
    participants: async (parent, _, context) => {
      return await context.participantsLoader.load(parent.id || parent._id.toString());
    },
    creator: async (parent, _, context) => {
      const userId = parent.creator.toString();
      
      try {
        let user = await context.userLoader.load(userId);
        if (!user) user = await User.findById(userId); 
        
        if (user) {
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role
          };
        }
      } catch (error) {
        console.error("Mongoose error:", error.message);
      }

      if (context.user && (context.user.id === userId || context.user._id === userId)) {
        return {
          id: userId,
          email: context.user.email || "admin2026@example.com",
          role: context.user.role || "User"
        };
      }

      throw new Error(`Неможливо завантажити дані автора.`);
    }
  },

  Participant: {
    user: async (parent, _, context) => {
      if (parent.user && parent.user.email) return parent.user;
      
      try {
        let user = await context.userLoader.load(parent.user.toString());
        if (!user) user = await User.findById(parent.user.toString());
        if (user) {
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role
          };
        }
      } catch (e) {
      }
      
      return { id: parent.user.toString(), email: "unknown", role: "User" };
    },
    event: async (parent) => {
      return await Event.findById(parent.event);
    }
  }
};