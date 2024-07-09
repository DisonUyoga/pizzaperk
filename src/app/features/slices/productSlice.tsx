import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GlobalErrorProps {
  error: string;
}

interface StateProps {
  globalErrors: string[];
  categoryModalVisible: boolean;
}
const initialState: StateProps = {
  globalErrors: [],
  categoryModalVisible: false,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    globalError(state, action: PayloadAction<GlobalErrorProps>) {
      const { error } = action.payload;
      state.globalErrors.push(error);
    },
    toggleCategoryModal(
      state,
      action: PayloadAction<{ categoryModalVisible: boolean }>
    ) {
      
      state.categoryModalVisible = !state.categoryModalVisible;
    },
  },
});

export const { globalError, toggleCategoryModal } = productSlice.actions;

export default productSlice.reducer;
