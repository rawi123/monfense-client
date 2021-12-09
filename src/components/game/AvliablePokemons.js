import React, { useState } from 'react'

import PokemonFight from './PokemonFight';





export default function AvliablePokemons({ turn,card, cards, setCards, setLand, pokemonProp, currentPlayer, avilablePokesShow, setvilablePokesShow, endTurn }) {
    const [fight, setFight] = useState("");
    const [pokemons, setPokemons] = useState({ myPokemon: "", enemy: "" });

    const handelFight = (pokemon) => {
        setvilablePokesShow("avilable-hidden");
        setFight("pokemon-fight");
        setPokemons({
            myPokemon: { ...pokemon, superPower: { avilable: true, roundsPassed: 0 }, heal: { avilable: true, roundsPassed: 0 } },
            enemy: { ...pokemonProp, superPower: { avilable: true, roundsPassed: 0 }, heal: { avilable: true, roundsPassed: 0 } },
            myInitialHp: pokemon.hp, ememyInitalHp: pokemonProp.hp
        })
        setLand("")
    }

    return (
        <>
            <div className={fight} style={{ overflow: "hidden" }}>
                {pokemons.myPokemon ?
                    <>
                        <PokemonFight turn={turn} currentPlayer={currentPlayer} card={card} cards={cards} setCards={setCards} endTurn={endTurn} pokemons={pokemons} setPokemons={setPokemons} />
                    </>
                    : null}
            </div>
            <div className={"avilable-hidden"} style={{ height: "avilable-hidden" === avilablePokesShow ? "0" : "80px" }}>
                {currentPlayer.pokemons.map((val) => {
                    return <img alt={val.name} onClick={() => handelFight(val)} className="pokemon-attack" key={val._id} src={require(`../../sprites-animations/${val.name}-front.gif`).default}></img>
                })}
            </div>
        </>
    )
}
