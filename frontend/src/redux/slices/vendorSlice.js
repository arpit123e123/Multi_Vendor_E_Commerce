import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import vendorService from "../../services/vendorService";

// ===============================
// Become Vendor
// ===============================

export const becomeVendor = createAsyncThunk(
  "vendor/becomeVendor",
  async (vendorData, thunkAPI) => {
    try {
      return await vendorService.becomeVendor(vendorData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ===============================
// Get Vendor Profile
// ===============================

export const getVendorProfile = createAsyncThunk(
  "vendor/getVendorProfile",
  async (_, thunkAPI) => {
    try {
      return await vendorService.getVendorProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ===============================
// Get Vendor Requests
// ===============================

export const getVendorRequests = createAsyncThunk(
  "vendor/getVendorRequests",
  async (_, thunkAPI) => {
    try {
      return await vendorService.getVendorRequests();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ===============================
// Approve Vendor
// ===============================

export const approveVendor = createAsyncThunk(
  "vendor/approveVendor",
  async (id, thunkAPI) => {
    try {
      await vendorService.approveVendor(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ===============================
// Reject Vendor
// ===============================

export const rejectVendor = createAsyncThunk(
  "vendor/rejectVendor",
  async (id, thunkAPI) => {
    try {
      await vendorService.rejectVendor(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const initialState = {
  vendor: null,
  requests: [],
  loading: false,
  success: false,
  error: false,
  message: "",
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,

  reducers: {
    resetVendorState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // Become Vendor
      .addCase(becomeVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(becomeVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.vendor = action.payload.vendor;
        state.message = action.payload.message;
      })
      .addCase(becomeVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })

      // Vendor Profile
      .addCase(getVendorProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVendorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.vendor = action.payload.vendor;
      })
      .addCase(getVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload;
      })

      // Requests
      .addCase(getVendorRequests.fulfilled, (state, action) => {
        state.requests = action.payload.vendors;
      })

      // Approve
      .addCase(approveVendor.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          (vendor) => vendor._id !== action.payload
        );
      })

      // Reject
      .addCase(rejectVendor.fulfilled, (state, action) => {
        state.requests = state.requests.filter(
          (vendor) => vendor._id !== action.payload
        );
      });
  },
});

export const { resetVendorState } = vendorSlice.actions;

export default vendorSlice.reducer;