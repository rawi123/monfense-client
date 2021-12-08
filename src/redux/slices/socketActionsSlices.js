import { createSlice } from "@reduxjs/toolkit";


//Intial State
const initialState = {
    actions: [],
}

const socketActionSlices = createSlice({
    name: "actions",
    initialState,
    reducers: {
        addAction: (state, action) => {
            state.actions = [...state.actions,action.payload];
        },
        addActions:(state,action)=>{
            state.actions = [...state.actions,...action.payload];
        }
    }
})


//generate the action creators
export const { addAction } = socketActionSlices.actions
export const { addActions } = socketActionSlices.actions
//export reducers
export default socketActionSlices.reducer;