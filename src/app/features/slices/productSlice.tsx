import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Tables } from "@/src/database.types";

interface GlobalErrorProps {
  error: string;
}

interface StateProps {
  globalErrors: string[];
  categoryModalVisible: boolean;
  product: Tables<"products"> | null;
}
const initialState: StateProps = {
  globalErrors: [],
  categoryModalVisible: false,
  product: null,
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
    setProduct(state, action: PayloadAction<{ product: Tables<"products"> }>) {
      const { product } = action.payload;
      state.product = product;
    },
  },
});

export const { globalError, toggleCategoryModal, setProduct } =
  productSlice.actions;

export default productSlice.reducer;
