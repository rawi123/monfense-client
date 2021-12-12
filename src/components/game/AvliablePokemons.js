import React from 'react'
import { useDispatch } from 'react-redux';
import socket from '../../api/socket';
import { setCurrentPlayer } from '../../redux/slices/currentPlayerSlices';






export default function AvliablePokemons({ setLand, pokemonProp, currentPlayer, avilablePokesShow }) {
    const dispatch = useDispatch()


    const handelFight = (pokemon) => {
        const pokemonFight = {
            myPokemon: { ...pokemon, superPower: { avilable: true, roundsPassed: 0 }, heal: { avilable: true, roundsPassed: 0 } },
            enemy: { ...pokemonProp, superPower: { avilable: true, roundsPassed: 0 }, heal: { avilable: true, roundsPassed: 0 } },
            myInitialHp: pokemon.hp, ememyInitalHp: pokemonProp.hp
        };
        const playerCurrent = { ...currentPlayer };

        const pokemons = playerCurrent.pokemons.map(val => {
            val = { ...val };
            if (val._id !== pokemon._id)
                val.roundsPassed += 1;
            else {
                val.roundsPassed = 0;
            }
            return val;
        })
        playerCurrent.pokemons = pokemons;
        dispatch(setCurrentPlayer({ currentPlayer: playerCurrent }));

        setLand("");
        socket.emit("fight-started", pokemonFight);
    }

    return (
        <>

            <div className={"avilable-hidden"} style={{ height: "avilable-hidden" === avilablePokesShow ? "0" : "80px" }}>
                {currentPlayer.pokemons.map((val) => {
                    return <img alt={val.name} style={{ opacity: val.roundsPassed < 1 ? 0.5 : 1 }} onClick={() => {
                        if (val.roundsPassed >= 1) {
                            handelFight(val)
                        }
                    }} className="pokemon-attack" key={val._id} src={require(`../../sprites-animations/${val.name}-front.gif`).default}></img>
                })}
            </div>
        </>
    )
}
