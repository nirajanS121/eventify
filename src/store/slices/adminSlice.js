import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAPI, promosAPI } from "../../services/api";

// ── Thunks ──
export const fetchAdminSettings = createAsyncThunk(
  "admin/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await adminAPI.getSettings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateAdminSettings = createAsyncThunk(
  "admin/updateSettings",
  async (body, { rejectWithValue }) => {
    try {
      return await adminAPI.updateSettings(body);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchPromos = createAsyncThunk(
  "admin/fetchPromos",
  async (_, { rejectWithValue }) => {
    try {
      return await promosAPI.getAll();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createPromoAsync = createAsyncThunk(
  "admin/createPromo",
  async (body, { rejectWithValue }) => {
    try {
      return await promosAPI.create(body);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updatePromoAsync = createAsyncThunk(
  "admin/updatePromo",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      return await promosAPI.update(id, body);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deletePromoAsync = createAsyncThunk(
  "admin/deletePromo",
  async (id, { rejectWithValue }) => {
    try {
      await promosAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await adminAPI.getDashboard();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ── Slice ──
const initialState = {
  qrCodeUrl: "",
  paymentInstructions:
    "Scan the QR code below and pay the exact event amount. After payment, upload a screenshot of the confirmation below.",
  promoCodes: [],
  dashboardStats: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAdminSettings.fulfilled, (s, a) => {
      s.qrCodeUrl = a.payload.qrCodeUrl || "";
      s.paymentInstructions =
        a.payload.paymentInstructions || s.paymentInstructions;
    });
    builder.addCase(updateAdminSettings.fulfilled, (s, a) => {
      if (a.payload.qrCodeUrl !== undefined) s.qrCodeUrl = a.payload.qrCodeUrl;
      if (a.payload.paymentInstructions !== undefined)
        s.paymentInstructions = a.payload.paymentInstructions;
    });
    builder.addCase(fetchPromos.fulfilled, (s, a) => {
      s.promoCodes = a.payload;
    });
    builder.addCase(createPromoAsync.fulfilled, (s, a) => {
      s.promoCodes.push(a.payload);
    });
    builder.addCase(updatePromoAsync.fulfilled, (s, a) => {
      const idx = s.promoCodes.findIndex(
        (p) => p.id === a.payload.id || p._id === a.payload._id,
      );
      if (idx !== -1) s.promoCodes[idx] = a.payload;
    });
    builder.addCase(deletePromoAsync.fulfilled, (s, a) => {
      s.promoCodes = s.promoCodes.filter(
        (p) => p.id !== a.payload && p._id !== a.payload,
      );
    });
    builder.addCase(fetchDashboardStats.fulfilled, (s, a) => {
      s.dashboardStats = a.payload;
    });
  },
});

export default adminSlice.reducer;
