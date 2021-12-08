import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/userSlices';
import pokemonsReducer from "../slices/pokemonSlices";
import playersReducer from "../slices/playersSlices";
import turnReducer from "../slices/turnSlices";
import socketEnabledReducer from "../slices/socketRunSlices";
import currentPlayerReducer from "../slices/currentPlayerSlices";
import socketActionReduce from "../slices/socketActionsSlices";

const store = configureStore({
    reducer: {
        user: userReducer,
        pokemons: pokemonsReducer,
        players: playersReducer,
        currentPlayer:currentPlayerReducer,
        turn:turnReducer,
        socketEnabled:socketEnabledReducer,
        socketActions:socketActionReduce
    },
})

export default store