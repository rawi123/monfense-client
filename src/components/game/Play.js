import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Store from '../Store/Store';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlayer } from '../../redux/slices/currentPlayerSlices';
import LandDetails from './LandDetails';
import { setPlayers } from '../../redux/slices/playersSlices';

export default function Play({ card, currentPlayer, endTurn,setCards, turn, cards }) {
    const { players } = useSelector(state => state.players);
    const [store, setStore] = useState("store");
    const [land, setLand] = useState("");
    const [currentState, setCurrentState] = useState(currentPlayer);
    const dispatch = useDispatch();

    console.log(cards);

    const handelUpgrade = () => {
        console.log(card,currentPlayer)
        if (currentPlayer.money >= card.card.pokemon.cost * 0.5) {
            const playersTemp = [...players];
            const currentPlayerTemp = { ...currentPlayer };
            const cardsTemp = [...cards];

            currentPlayerTemp.money -= parseInt(card.card.pokemon.cost * 0.5);
            playersTemp[turn] = currentPlayerTemp;
            cardsTemp[card.pos].houses += 1;
            setCards(cardsTemp);
            dispatch(setCurrentPlayer({ currentPlayer: currentPlayerTemp }));
            dispatch(setPlayers({ players: playersTemp }));
        }

    }

    const handelBuy = (pokemon, error) => {
        const currentPlayerTemp = { ...currentPlayer };

        if (currentPlayerTemp.money > pokemon.cost) {
            currentPlayerTemp.money -= pokemon.cost;
            currentPlayerTemp.pokemons = [...currentPlayerTemp.pokemons, pokemon];
            dispatch(setCurrentPlayer({ currentPlayer: currentPlayerTemp }));
            setCurrentState(currentPlayerTemp)
        }
        else {
            error();
        }
    }


    if (card.card === "store") {
        return (
            <div className="flex column">
                <Button onClick={() => setStore("store")}>Open Store</Button>
                <Button onClick={() => endTurn(false, currentState, turn)}>End turn</Button>
                <Store handelBuyProp={handelBuy} userProp={currentPlayer} classToPut={store} setStore={setStore} />
            </div>
        )
    }

    if (typeof card.card === "object" && card.card.owner === currentPlayer.number && cards[card.pos].houses < 3) {
        return (
            <div className="flex column">
                <Button onClick={() => setLand(land === "store" ? "none" : "store")}>Land details</Button>
                <Button onClick={() => endTurn(false, currentState, turn)}>End Turn</Button>
                <Button onClick={handelUpgrade} >Upgrade</Button>
                <LandDetails classToPut={land} pokemon={card.card.pokemon} />
            </div>
        )
    }

    if (typeof card.card === "object") {

        return (
            <div className="flex column">
                <Button onClick={() => setLand(land === "store" ? "none" : "store")}>Land details</Button>
                <Button onClick={() => endTurn(false, currentState, turn)}>End Turn</Button>
                <LandDetails classToPut={land} pokemon={card.card.pokemon} />
            </div>
        )
    }
    return <></>
}
