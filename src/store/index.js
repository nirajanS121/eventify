import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventsReducer from "./slices/eventsSlice";
import bookingReducer from "./slices/bookingSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    booking: bookingReducer,
    admin: adminReducer,
  },
});

export default store;
