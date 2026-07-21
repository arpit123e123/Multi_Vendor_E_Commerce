import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "../../services/orderService";

const getErrorPayload = (err, fallbackMessage) => {
  const data = err.response?.data;

  if (typeof data === "string") {
    return { message: data };
  }

  return {
    message: data?.message || err.message || fallbackMessage,
    status: err.response?.status,
  };
};

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ addressId, paymentMethod }, { rejectWithValue }) => {
    try {
      return await orderService.createOrder({ addressId, paymentMethod });
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to place order"));
    }
  }
);

export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getMyOrders();
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to fetch orders"));
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    placeOrderLoading: false,
    error: null,
    placeOrderError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placeOrderLoading = true;
        state.placeOrderError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placeOrderLoading = false;
        state.currentOrder = action.payload.order;
        if (action.payload.order) {
          state.orders = [
            action.payload.order,
            ...state.orders.filter(
              (order) => order._id !== action.payload.order._id
            ),
          ];
        }
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placeOrderLoading = false;
        state.placeOrderError = action.payload?.message || action.error.message;
      })
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default orderSlice.reducer;
