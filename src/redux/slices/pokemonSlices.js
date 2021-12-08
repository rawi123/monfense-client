import { createSlice } from "@reduxjs/toolkit";


//Intial State
const initialState = {
    pokemons: null,
}

const pokemonSlices = createSlice({
    name: "pokemons",
    initialState,
    reducers: {

        setPokemons: (state, action) => {
            state.pokemons = action.payload.pokemons
        },
    }

})


//generate the action creators
export const { setPokemons } = pokemonSlices.actions
//export reducers
export default pokemonSlices.reducer;