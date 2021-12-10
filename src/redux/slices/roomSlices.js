import { createSlice } from "@reduxjs/toolkit";


//Intial State
const initialState = {
    room: 0,
}

const roomSlices = createSlice({
    name: "room",
    initialState,
    reducers: {

        setRoom: (state, action) => {
            state.room = action.payload
        },
    }

})


//generate the action creators
export const { setRoom } = roomSlices.actions
//export reducers
export default roomSlices.reducer;