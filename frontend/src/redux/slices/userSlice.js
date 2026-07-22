import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, thunkAPI) => {
    try {
      return await userService.getProfile();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, thunkAPI) => {
    try {
      return await userService.updateProfile(userData);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (passwordData, thunkAPI) => {
    try {
      return await userService.changePassword(passwordData);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null,
  },

  reducers: {
    clearUserState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.success = action.payload.message;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.success = action.payload.message;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUserState } = userSlice.actions;

export default userSlice.reducer;