import { createSlice } from "@reduxjs/toolkit";


//Intial State
const initialState = {
    currentPlayer: null,
}

const currentPlayerSlices = createSlice({
    name: "currentPlayer",
    initialState,
    reducers: {

        setCurrentPlayer: (state, action) => {
            state.currentPlayer = action.payload.currentPlayer
        },
        setCurrentPlayerPos: (state, action) => {
            state.currentPlayer.pos = action.payload.pos
        },
    }

})


//generate the action creators
export const { setCurrentPlayer } = currentPlayerSlices.actions
export const { setCurrentPlayerPos } = currentPlayerSlices.actions
//export reducers
export default currentPlayerSlices.reducer;