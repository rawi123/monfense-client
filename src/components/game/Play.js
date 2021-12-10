import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Store from '../Store/Store';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlayer } from '../../redux/slices/currentPlayerSlices';
import LandDetails from './LandDetails';
import { setPlayers } from '../../redux/slices/playersSlices';
import AvliablePokemons from './AvliablePokemons';

export default function Play({ card, currentPlayer, endTurn, setCards, turn, cards }) {
    const { players } = useSelector(state => state.players);
    const [store, setStore] = useState("store");
    const [land, setLand] = useState("");
    const [avilablePokesShow, setvilablePokesShow] = useState("avilable-hidden");
    const [currentState, setCurrentState] = useState(currentPlayer);
    const dispatch = useDispatch();

    const handelAttack = () => {
        setvilablePokesShow(avilablePokesShow === "avilable-show" ? "avilable-hidden" : "avilable-show");
    }

    const haveAllHouses = () => {
        const housesSameColor = cards.reduce((sum, val) => {
            if (typeof val === "object" && val.pokemon.color === card.card.pokemon.color)
                sum++;
            return sum
        }, 0)
        if (housesSameColor === 3) return true;
        return false;
    }

    const handelUpgrade = () => {
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

    console.log(card.card)
    if (card.card === "store") {
        return (
            <div className="flex column">
                <Button onClick={() => setStore("store")}>Open Store</Button>
                <Button onClick={() => endTurn(false, currentState, turn)}>End turn</Button>
                <Store handelBuyProp={handelBuy} userProp={currentPlayer} classToPut={store} setStore={setStore} />
            </div>
        )
    }
    
    if (typeof card.card === "object" && card.card.owner === currentPlayer.number && cards[card.pos].houses < 3 && haveAllHouses()) {
        return (
            <div className="flex column">
                <Button onClick={() => setLand(land === "store" ? "none" : "store")}>Land details</Button>
                <Button onClick={() => endTurn(false, currentState, turn)}>End Turn</Button>
                {haveAllHouses ? <Button onClick={handelUpgrade} >Upgrade</Button> : null}
                <LandDetails classToPut={land} pokemon={card.card.pokemon} />
            </div>
        )
    }

    if (typeof card.card === "object") {

        return (
            <div className="flex column">
                <Button onClick={() => setLand(land === "store" ? "none" : "store")}>Land details</Button>
                {card.card.owner === null && currentPlayer.pokemons.length && currentPlayer.money >= card.card.pokemon.cost ? <Button onClick={() => handelAttack()}>Attack</Button> : null}
                <Button onClick={() => endTurn(false, currentState, turn)}>End Turn</Button>
                <LandDetails classToPut={land} pokemon={card.card.pokemon} />
                <AvliablePokemons setLand={setLand} pokemonProp={card.card.pokemon} setvilablePokesShow={setvilablePokesShow} currentPlayer={currentPlayer} avilablePokesShow={avilablePokesShow} />
            </div>
        )
    }
    return <></>
}
