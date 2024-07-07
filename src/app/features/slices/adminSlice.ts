
import { PayloadAction, createSlice } from '@reduxjs/toolkit'



interface StateProps{
    freeDeliveryDateOffer: string
}
const initialState:StateProps = {

    freeDeliveryDateOffer:""

}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setFreeDeliveryDate(state, action: PayloadAction<StateProps>){
        const {freeDeliveryDateOffer}=action.payload
        state.freeDeliveryDateOffer=freeDeliveryDateOffer
    }
  }
});

export const {setFreeDeliveryDate} = adminSlice.actions

export default adminSlice.reducer