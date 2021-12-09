import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPokemons } from '../../api/pokemonApi'
import { setPokemons } from '../../redux/slices/pokemonSlices'
import Land from './Land'
import LuckyLand from './LuckyLand'
import StoreLand from './StoreLand'
import PokemonLand from "./PokemonLand"
import JailLand from './JailLand'
import TaxPrize from './TaxPrize'


export default function Board({ cards, setCards,haveToSell }) {
    const { pokemons } = useSelector(state => state?.pokemons);
    const dispatch = useDispatch();

    const createPokemon = (number,owner=null,houses=null) => {
        return { pokemon: pokemons[number], owner, houses: houses||2 };
    }

    useEffect(() => {
        if (pokemons === null) {
            (async () => {
                const pokemons = await getPokemons();
                dispatch(setPokemons({ pokemons }))
            })()
        }

        else {
            const arr = ["go", createPokemon(0), createPokemon(1), createPokemon(2), "tax", createPokemon(3), createPokemon(4), createPokemon(5), "prize", "card", "store", createPokemon(6), createPokemon(7), createPokemon(8), "prize", createPokemon(9), "tax", createPokemon(10), createPokemon(11), "card", "jail", createPokemon(12), createPokemon(13,0,1), createPokemon(14), "card", createPokemon(15), createPokemon(16), "tax", "card", createPokemon(17), "store", "tax", "prize", createPokemon(18), createPokemon(19), createPokemon(20), "card", createPokemon(21), createPokemon(22), createPokemon(23)];
            setCards(arr);
        }// eslint-disable-next-line
    }, [pokemons])


    return (
        <div className="board">

            {pokemons ? [...Array(40)].map((val, i) => {
                if (typeof cards[i] === "object") {
                    return <Land key={i} haveToSell={haveToSell} classGive={`land${i + 1}`} cardNumber={i}  children={<PokemonLand cardNumber={i} setCards={setCards} cards={cards} haveToSell={haveToSell} card={cards[i]} />} />
                }
                if (cards[i] === "tax" || cards[i] === "prize") {
                    return <Land key={i} haveToSell={haveToSell} classGive={`land${i + 1}`} cardNumber={i} children={<TaxPrize card={cards[i]} />} />
                }
                if (cards[i] === "store") {
                    return <Land key={i} haveToSell={haveToSell} classGive={`land${i + 1}`} cardNumber={i} children={<StoreLand card={cards[i]} />} />
                }
                if (cards[i] === "card") {
                    return <Land key={i} haveToSell={haveToSell} classGive={`land${i + 1}`} cardNumber={i} children={<LuckyLand  />} />
                }
                return <Land key={i} haveToSell={haveToSell} classGive={`land${i + 1}`} cardNumber={i} children={<JailLand card={cards[i]} />} />
            }) : null}

        </div>
    )
}
