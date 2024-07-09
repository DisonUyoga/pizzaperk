import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import AuthSlice from "./slices/AuthSlice";
import productSlice from "./slices/productSlice";
import adminSlice from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: AuthSlice,
    product: productSlice,
    admin: adminSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
