import { createSlice } from "@reduxjs/toolkit";


//Intial State
const initialState = {
    turn: 0,
}

const turnSlices = createSlice({
    name: "turn",
    initialState,
    reducers: {

        setTurn: (state, action) => {
            state.turn = action.payload
        },
    }

})


//generate the action creators
export const { setTurn } = turnSlices.actions
//export reducers
export default turnSlices.reducer;