import { createSlice } from "@reduxjs/toolkit";


//Intial State
const initialState = {
    pokemons: {},
    fight: ""
}

const pokemonFightSlices = createSlice({
    name: "pokemons",
    initialState,
    reducers: {

        setFightPokemons: (state, action) => {
            state.pokemons = action.payload
        },
        setFight: (state, action) => {
            state.fight = action.payload
        }
    }

})


//generate the action creators
export const { setFightPokemons } = pokemonFightSlices.actions
export const { setFight } = pokemonFightSlices.actions
//export reducers
export default pokemonFightSlices.reducer;