import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingsAPI, waitlistAPI, favoritesAPI } from "../../services/api";

// ── Thunks ──
export const fetchBookings = createAsyncThunk(
  "booking/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await bookingsAPI.getMy(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAllAdmin",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await bookingsAPI.getAll(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createBooking = createAsyncThunk(
  "booking/create",
  async (body, { rejectWithValue }) => {
    try {
      return await bookingsAPI.create(body);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateBookingStatusAsync = createAsyncThunk(
  "booking/updateStatus",
  async ({ bookingId, body }, { rejectWithValue }) => {
    try {
      return await bookingsAPI.updateStatus(bookingId, body);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const addToWaitlistAsync = createAsyncThunk(
  "booking/waitlist",
  async (body, { rejectWithValue }) => {
    try {
      return await waitlistAPI.add(body);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const toggleFavoriteAsync = createAsyncThunk(
  "booking/toggleFav",
  async (eventId, { rejectWithValue }) => {
    try {
      const data = await favoritesAPI.toggle(eventId);
      localStorage.setItem(
        "eventify_favorites",
        JSON.stringify(data.favorites),
      );
      return data.favorites;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchFavorites = createAsyncThunk(
  "booking/fetchFavs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await favoritesAPI.getAll();
      localStorage.setItem(
        "eventify_favorites",
        JSON.stringify(data.favorites),
      );
      return data.favorites;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ── Slice ──
const initialState = {
  bookings: [],
  currentBooking: null,
  waitlist: [],
  favorites: JSON.parse(localStorage.getItem("eventify_favorites") || "[]"),
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchBookings.pending, (s) => {
      s.loading = true;
    });
    builder.addCase(fetchBookings.fulfilled, (s, a) => {
      s.loading = false;
      s.bookings = a.payload;
    });
    builder.addCase(fetchBookings.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    builder.addCase(fetchAllBookings.pending, (s) => {
      s.loading = true;
    });
    builder.addCase(fetchAllBookings.fulfilled, (s, a) => {
      s.loading = false;
      s.bookings = a.payload;
    });
    builder.addCase(fetchAllBookings.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    builder.addCase(createBooking.fulfilled, (s, a) => {
      s.bookings.push(a.payload);
      s.currentBooking = a.payload;
    });

    builder.addCase(updateBookingStatusAsync.fulfilled, (s, a) => {
      const idx = s.bookings.findIndex(
        (b) => b.id === a.payload.id || b._id === a.payload._id,
      );
      if (idx !== -1) s.bookings[idx] = a.payload;
    });

    builder.addCase(addToWaitlistAsync.fulfilled, (s, a) => {
      s.waitlist.push(a.payload);
    });

    builder.addCase(toggleFavoriteAsync.fulfilled, (s, a) => {
      s.favorites = a.payload;
    });
    builder.addCase(fetchFavorites.fulfilled, (s, a) => {
      s.favorites = a.payload;
    });
  },
});

export default bookingSlice.reducer;
