import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// =========================
// LOGIN
// =========================

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.login(userData);

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message || "Login failed",
        }
      );
    }
  }
);

// =========================
// SAFE USER PARSER
// =========================

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

// =========================
// INITIAL STATE
// =========================

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: getStoredUser(),
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // LOGIN PENDING
      // =========================

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // =========================
      // LOGIN SUCCESS
      // =========================

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const user = action.payload?.user;
        const token = action.payload?.token;

        state.user = user;

        if (token) {
          localStorage.setItem("token", token);
        }

        if (user) {
          localStorage.setItem(
            "user",
            JSON.stringify(user)
          );
        }
      })

      // =========================
      // LOGIN FAILED
      // =========================

      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || {
            message: "Login failed",
          };
      });
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;