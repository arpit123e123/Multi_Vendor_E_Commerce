import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";

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

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await cartService.addToCart({ productId, quantity });
    } catch (err) {
      return rejectWithValue(
        getErrorPayload(err, "Failed to add item to cart"),
      );
    }
  },
);

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to fetch cart"));
    }
  },
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await cartService.updateCart(productId, quantity);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to update cart"));
    }
  },
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (productId, { rejectWithValue }) => {
    try {
      return await cartService.removeItem(productId);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err, "Failed to remove item"));
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
    updatingProductId: null,
    removingProductId: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.updatingProductId = null;
      state.removingProductId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart?.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart?.items || [];
      })
   
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.items = action.payload?.status === 404 ? [] : state.items;
        state.error =
          action.payload?.status === 404
            ? null
            : action.payload?.message || action.error.message;
      })
      .addCase(updateCart.pending, (state, action) => {
        state.error = null;

        const { productId, quantity } = action.meta.arg;

        state.updatingProductId = productId;

        const item = state.items.find(
          (item) => item.product?._id === productId,
        );

        if (item) {
          item.quantity = quantity;
        }
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.updatingProductId = null;

        if (action.payload.cart?.items) {
          state.items = action.payload.cart.items;
        }
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.updatingProductId = null;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(removeItem.pending, (state, action) => {
        state.error = null;

        const productId = action.meta.arg;

        state.removingProductId = productId;

        state.items = state.items.filter(
          (item) => item.product?._id !== productId,
        );
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.removingProductId = null;

        if (action.payload.cart?.items) {
          state.items = action.payload.cart.items;
        }
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.removingProductId = null;
        state.error = action.payload?.message || action.error.message;
      });
      
  },
});

export const { clearCartState } = cartSlice.actions;

export default cartSlice.reducer;
