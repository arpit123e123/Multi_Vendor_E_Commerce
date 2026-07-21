import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";


export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {

    try {

      const data = await authService.login(userData);

      return data;

    } catch (err) {

      return rejectWithValue(
        err.response?.data || err.message
      );

    }

  }
);



const authSlice = createSlice({

  name: "auth",

  initialState: {

    user: JSON.parse(
      localStorage.getItem("user") || "null"
    ),

    loading: false,

    error: null,

  },


  reducers: {

    logout: (state) => {

      state.user = null;

      localStorage.removeItem("token");

      localStorage.removeItem("user");

    },

  },


  extraReducers: (builder) => {

    builder


    .addCase(login.pending, (state)=>{

      state.loading = true;

      state.error = null;

    })


    .addCase(login.fulfilled,(state,action)=>{

      state.loading = false;


      state.user = action.payload.user;


      state.error = null;



      localStorage.setItem(
        "token",
        action.payload.token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
      );


    })


    .addCase(login.rejected,(state,action)=>{

      state.loading = false;

      state.error = action.payload;

    });


  },


});


export const { logout } = authSlice.actions;

export default authSlice.reducer;