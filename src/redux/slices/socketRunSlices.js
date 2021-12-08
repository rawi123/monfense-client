import { createSlice } from "@reduxjs/toolkit";


//Intial State
const initialState = {
    socketEnabled: false,
}

const socketEnabledSlices = createSlice({
    name: "socketEnabled",
    initialState,
    reducers: {
        setSocketEnabled: (state, action) => {
            state.socketEnabled = action.payload;
        },
    }

})


//generate the action creators
export const { setSocketEnabled } = socketEnabledSlices.actions
//export reducers
export default socketEnabledSlices.reducer;