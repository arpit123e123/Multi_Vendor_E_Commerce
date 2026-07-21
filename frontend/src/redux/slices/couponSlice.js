import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import couponService from "../../services/couponService";

const getErrorPayload = (err, fallbackMessage) => {
  const data = err.response?.data;

  if (typeof data === "string") {
    return { message: data, status: err.response?.status };
  }

  return {
    message: data?.message || err.message || fallbackMessage,
    status: err.response?.status,
  };
};

// Admin

export const getCoupons = createAsyncThunk(
  "coupon/getCoupons",
  async (_, { rejectWithValue }) => {
    try {
      return await couponService.getCoupons();
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to fetch coupons"));
    }
  },
);

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      return await couponService.createCoupon(couponData);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to create coupon"));
    }
  },
);

export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      return await couponService.updateCoupon(id, couponData);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to update coupon"));
    }
  },
);

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await couponService.deleteCoupon(id);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to delete coupon"));
    }
  },
);

// User

export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      return await couponService.applyCoupon(couponData);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to apply coupon"));
    }
  },
);

const couponSlice = createSlice({
  name: "coupon",

  initialState: {
    coupons: [],
    appliedCoupon: null,
    discount: 0,
    finalAmount: 0,
    loading: false,
    error: null,
  },

  reducers: {
    clearCoupon(state) {
      state.appliedCoupon = null;
      state.discount = 0;
      state.finalAmount = 0;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
      })

      .addCase(getCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload.coupons || [];
      })

      .addCase(getCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload.coupon);
      })

      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.map((coupon) =>
          coupon._id === action.payload.coupon._id
            ? action.payload.coupon
            : coupon,
        );
      })

      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== action.payload,
        );
      })

      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload;
        state.discount = action.payload.discount;
        state.finalAmount = action.payload.finalAmount;
      })

      .addCase(applyCoupon.rejected, (state, action) => {
        state.error = action.payload?.message;
      });
  },
});

export const { clearCoupon } = couponSlice.actions;

export default couponSlice.reducer;
