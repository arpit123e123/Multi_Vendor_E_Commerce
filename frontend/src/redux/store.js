import { configureStore } from "@reduxjs/toolkit";
import couponReducer from "./slices/couponSlice";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";
import addressReducer from "./slices/addressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    address: addressReducer,
    coupon: couponReducer,
  },
});
