import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { fetchParticipants as fetchParticipantsApi } from '../../api/mockApi';

const participantsAdapter = createEntityAdapter();

export const fetchParticipants = createAsyncThunk(
  'participants/fetchParticipants',
  async ({ eventId, page }, { rejectWithValue }) => {
    try {
      const response = await fetchParticipantsApi(eventId, page);
      if (response.length === 0) return { participants: [], hasMore: false };
      return { participants: response, hasMore: true };
    } catch (error) {
      // Використовуємо змінну error для уникнення помилки лінтера
      console.error("Помилка завантаження учасників API:", error);
      return rejectWithValue("Помилка завантаження учасників");
    }
  }
);

const participantsSlice = createSlice({
  name: 'participants',
  initialState: participantsAdapter.getInitialState({
    status: 'idle',
    error: null,
    hasMore: true,
    filterTerm: '',
  }),
  reducers: {
    clearParticipants: (state) => {
      participantsAdapter.removeAll(state);
      state.hasMore = true;
      state.status = 'idle';
      state.filterTerm = '';
      state.error = null;
    },
    setFilterTerm: (state, action) => {
      state.filterTerm = action.payload;
    },
    clearParticipantsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipants.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        participantsAdapter.addMany(state, action.payload.participants);
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearParticipants, setFilterTerm, clearParticipantsError } = participantsSlice.actions;

const { selectAll } = participantsAdapter.getSelectors(state => state.participants);

export const selectFilteredParticipants = createSelector(
  [selectAll, (state) => state.participants.filterTerm],
  (participants, term) => {
    if (!term) return participants;
    const lowerTerm = term.toLowerCase();
    return participants.filter(p => 
      p.name.toLowerCase().includes(lowerTerm) || 
      p.email.toLowerCase().includes(lowerTerm)
    );
  }
);

export default participantsSlice.reducer;