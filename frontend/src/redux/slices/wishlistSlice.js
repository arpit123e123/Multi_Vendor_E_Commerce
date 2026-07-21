import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistService from "../../services/wishlistService";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistService.getWishlist();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistService.addToWishlist(productId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistService.removeFromWishlist(productId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist?.products || action.payload.products || [];
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist?.products || state.items;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist?.products || state.items;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;

export default wishlistSlice.reducer;
