import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import participantsReducer from './slices/participantsSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    participants: participantsReducer,
    theme: themeReducer,
  },
});