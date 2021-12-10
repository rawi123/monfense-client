import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/userSlices';
import pokemonsReducer from "../slices/pokemonSlices";
import playersReducer from "../slices/playersSlices";
import turnReducer from "../slices/turnSlices";
import socketEnabledReducer from "../slices/socketRunSlices";
import pokemonFightReducer from "../slices/pokemonFightSlices";
import currentPlayerReducer from "../slices/currentPlayerSlices";
import socketActionReduce from "../slices/socketActionsSlices";
import roomReducer from "../slices/roomSlices";

const store = configureStore({
    reducer: {
        user: userReducer,
        pokemons: pokemonsReducer,
        players: playersReducer,
        currentPlayer: currentPlayerReducer,
        turn: turnReducer,
        socketEnabled: socketEnabledReducer,
        socketActions: socketActionReduce,
        pokemonFight: pokemonFightReducer,
        room: roomReducer
    },
})

export default store;