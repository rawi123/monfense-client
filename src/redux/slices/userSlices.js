import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../../api/userApi"


export const fetchUser = createAsyncThunk('user/login', async (payload, { rejectWithValue, getState, dispatch }) => {
    const response = await getUser();
    return response;

})

//Intial State
const initialState = {
    user: null,
}

const userSlices = createSlice({
    name: "user",
    initialState,
    reducers: {

        setUser: (state, action) => {
            state.user = action.payload.user;
            state.decline=action.payload?.decline;
        },
    },
    extraReducers: {
        [fetchUser.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.decline = false;
        },
        [fetchUser.rejected]: (state) => {
            state.decline = true;
        }

    }

})


//generate the action creators
export const { setUser } = userSlices.actions
//export reducers
export default userSlices.reducer;