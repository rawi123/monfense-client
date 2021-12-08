import { createSlice } from "@reduxjs/toolkit";


//Intial State
const initialState = {
    players: [],
}

const playersSlices = createSlice({
    name: "players",
    initialState,
    reducers: {
        setPlayers: (state, action) => {
            state.players = action.payload.players;
        },
        addPlayer: (state, action) => {
            state.players.push(action.payload.player);
        }
    }

})


//generate the action creators
export const { setPlayers } = playersSlices.actions
export const { addPlayer } = playersSlices.actions
//export reducers
export default playersSlices.reducer;