import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCourses as fetchCoursesApi } from '../../api/mockApi';

export const fetchCourses = createAsyncThunk(
  'events/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCoursesApi();
      return response;
    } catch (error) {
      // Використовуємо змінну error для уникнення помилки лінтера
      console.error("Помилка завантаження курсів:", error);
      return rejectWithValue("Не вдалося завантажити курси");
    }
  }
);

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('favorite_courses');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    // Використовуємо змінну e для уникнення помилки лінтера
    console.error("Помилка читання localStorage:", e);
    return [];
  }
};

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    favorites: loadFavorites(),
    status: 'idle',
    error: null,
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(favId => favId !== id);
      } else {
        state.favorites.push(id);
      }
      localStorage.setItem('favorite_courses', JSON.stringify(state.favorites));
    },
    clearEventsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { toggleFavorite, clearEventsError } = eventsSlice.actions;
export default eventsSlice.reducer;