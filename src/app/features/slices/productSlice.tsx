import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GlobalErrorProps {
  error: string;
}

interface StateProps {
  globalErrors: string[];
}
const initialState: StateProps = {
  globalErrors: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    globalError(state, action: PayloadAction<GlobalErrorProps>) {
      const { error } = action.payload;
      state.globalErrors.push(error);
    },
  },
});

export const { globalError } = productSlice.actions;

export default productSlice.reducer;
