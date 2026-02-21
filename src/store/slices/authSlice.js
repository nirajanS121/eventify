import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";

// ── Thunks ──
export const registerUser = createAsyncThunk(
  "auth/register",
  async (body, { rejectWithValue }) => {
    try {
      const data = await authAPI.register(body);
      localStorage.setItem("eventify_token", data.token);
      localStorage.setItem("eventify_user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const loginUserAsync = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const data = await authAPI.login(body);
      localStorage.setItem("eventify_token", data.token);
      localStorage.setItem("eventify_user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const loginAdminAsync = createAsyncThunk(
  "auth/adminLogin",
  async (body, { rejectWithValue }) => {
    try {
      const data = await authAPI.adminLogin(body);
      localStorage.setItem("eventify_token", data.token);
      localStorage.setItem("eventify_admin", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      return await authAPI.getMe();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateProfileAsync = createAsyncThunk(
  "auth/updateProfile",
  async (body, { rejectWithValue }) => {
    try {
      const data = await authAPI.updateProfile(body);
      localStorage.setItem("eventify_user", JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ── Slice ──
const storedUser = JSON.parse(localStorage.getItem("eventify_user") || "null");
const storedAdmin = JSON.parse(
  localStorage.getItem("eventify_admin") || "null",
);
const storedToken = localStorage.getItem("eventify_token") || null;

const initialState = {
  user: storedUser,
  admin: storedAdmin,
  token: storedToken,
  isAuthenticated: !!storedUser,
  isAdmin: !!storedAdmin,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("eventify_user");
      localStorage.removeItem("eventify_token");
    },
    logoutAdmin(state) {
      state.admin = null;
      state.token = null;
      state.isAdmin = false;
      localStorage.removeItem("eventify_admin");
      localStorage.removeItem("eventify_token");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(registerUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(registerUser.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload.user;
      s.token = a.payload.token;
      s.isAuthenticated = true;
    });
    builder.addCase(registerUser.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });
    // login
    builder.addCase(loginUserAsync.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(loginUserAsync.fulfilled, (s, a) => {
      s.loading = false;
      s.user = a.payload.user;
      s.token = a.payload.token;
      s.isAuthenticated = true;
    });
    builder.addCase(loginUserAsync.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });
    // admin login
    builder.addCase(loginAdminAsync.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(loginAdminAsync.fulfilled, (s, a) => {
      s.loading = false;
      s.admin = a.payload.user;
      s.token = a.payload.token;
      s.isAdmin = true;
    });
    builder.addCase(loginAdminAsync.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });
    // fetchMe
    builder.addCase(fetchMe.fulfilled, (s, a) => {
      s.user = a.payload;
      s.isAuthenticated = true;
    });
    // updateProfile
    builder.addCase(updateProfileAsync.fulfilled, (s, a) => {
      s.user = a.payload;
    });
  },
});

export const { logoutUser, logoutAdmin, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
