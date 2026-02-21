import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { eventsAPI } from "../../services/api";

// ── Thunks ──
export const fetchEvents = createAsyncThunk(
  "events/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await eventsAPI.getAll(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchEvent = createAsyncThunk(
  "events/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await eventsAPI.getOne(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createEvent = createAsyncThunk(
  "events/create",
  async (body, { rejectWithValue }) => {
    try {
      return await eventsAPI.create(body);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateEventAsync = createAsyncThunk(
  "events/update",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      return await eventsAPI.update(id, body);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteEventAsync = createAsyncThunk(
  "events/delete",
  async (id, { rejectWithValue }) => {
    try {
      await eventsAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateBookedCountAsync = createAsyncThunk(
  "events/updateBooked",
  async ({ eventId, increment }, { rejectWithValue }) => {
    try {
      return await eventsAPI.updateBooked(eventId, increment);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ── Slice ──
const initialState = {
  events: [],
  selectedEvent: null,
  filters: { type: "all", search: "", difficulty: "all" },
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedEvent(state, action) {
      state.selectedEvent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEvents.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(fetchEvents.fulfilled, (s, a) => {
      s.loading = false;
      s.events = a.payload;
    });
    builder.addCase(fetchEvents.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    builder.addCase(fetchEvent.fulfilled, (s, a) => {
      s.selectedEvent = a.payload;
    });

    builder.addCase(createEvent.fulfilled, (s, a) => {
      s.events.push(a.payload);
    });
    builder.addCase(updateEventAsync.fulfilled, (s, a) => {
      const idx = s.events.findIndex(
        (e) => e.id === a.payload.id || e._id === a.payload._id,
      );
      if (idx !== -1) s.events[idx] = a.payload;
    });
    builder.addCase(deleteEventAsync.fulfilled, (s, a) => {
      s.events = s.events.filter(
        (e) => e.id !== a.payload && e._id !== a.payload,
      );
    });
    builder.addCase(updateBookedCountAsync.fulfilled, (s, a) => {
      const idx = s.events.findIndex(
        (e) => e.id === a.payload.id || e._id === a.payload._id,
      );
      if (idx !== -1) s.events[idx] = a.payload;
    });
  },
});

export const { setFilters, setSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
