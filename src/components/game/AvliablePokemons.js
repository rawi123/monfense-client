import React from 'react'
import socket from '../../api/socket';






export default function AvliablePokemons({ setLand, pokemonProp, currentPlayer, avilablePokesShow }) {



    const handelFight = (pokemon) => {
        const pokemonFight = {
            myPokemon: { ...pokemon, superPower: { avilable: true, roundsPassed: 0 }, heal: { avilable: true, roundsPassed: 0 } },
            enemy: { ...pokemonProp, superPower: { avilable: true, roundsPassed: 0 }, heal: { avilable: true, roundsPassed: 0 } },
            myInitialHp: pokemon.hp, ememyInitalHp: pokemonProp.hp
        };
        setLand("");
        socket.emit("fight-started", pokemonFight);
    }

    return (
        <>

            <div className={"avilable-hidden"} style={{ height: "avilable-hidden" === avilablePokesShow ? "0" : "80px" }}>
                {currentPlayer.pokemons.map((val) => {
                    return <img alt={val.name} onClick={() => handelFight(val)} className="pokemon-attack" key={val._id} src={require(`../../sprites-animations/${val.name}-front.gif`).default}></img>
                })}
            </div>
        </>
    )
}
