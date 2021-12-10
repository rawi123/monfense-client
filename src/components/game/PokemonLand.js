import React from 'react';
//  <img style={{ width: "80%", height: "50%" }} src={require(`../../sprites-animations/${card.name}-front.gif`).default}></img> 
import blueHouse from "../../images/blue-house.png"
import greenHouse from "../../images/green-house.png"
import yellowHouse from "../../images/yellow-house.png"
import redHouse from "../../images/red-house.png"
import blueHotel from "../../images/hotel-blue.png"
import greenHotel from "../../images/hotel-green.png"
import yellowHotel from "../../images/hotel-yellow.png"
import redHotel from "../../images/hotel-red.png"
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlayer } from "../../redux/slices/currentPlayerSlices";
import { setPlayers } from "../../redux/slices/playersSlices";

export default function PokemonLand({ card, haveToSell, cards, setCards, cardNumber }) {
    const { currentPlayer } = useSelector(state => state.currentPlayer);
    const { players } = useSelector(state => state.players);
    const { turn } = useSelector(state => state.turn)
    const dispatch = useDispatch();
    const sellBuilding = () => {
        if (haveToSell && card.owner === currentPlayer?.number && turn === currentPlayer?.number) {
            const playersTemp = [...players];
            const currentPlayerTemp = { ...currentPlayer };
            const cardsTemp = [...cards];

            currentPlayerTemp.money += parseInt(card.pokemon.cost * 0.5);
            playersTemp[turn] = currentPlayerTemp;

            if (cardsTemp[cardNumber].houses > 1) {
                cardsTemp[cardNumber].houses -= 1;
            }
            else {
                cardsTemp[cardNumber].houses = 0;
                cardsTemp[cardNumber].owner = null;
            }

            setCards(cardsTemp);
            dispatch(setCurrentPlayer({ currentPlayer: currentPlayerTemp }));
            dispatch(setPlayers({ players: playersTemp }));
        }
    }

    return (//1-9 21-29
        <div className={`poke-card ${haveToSell && card.owner === currentPlayer?.number && turn === currentPlayer?.number ? "enable-sell" : null}`}
            onClick={() => sellBuilding()}>
            <p style={{ background: card.pokemon.color, width: "100%", color: card.pokemon.color === "blue" ? "white" : "black" }}>{card.pokemon.name}</p>
            <div className="flex center">
                {card.owner !== null ? card.houses === 3 ?
                    <img className={`hotel ${(cardNumber >= 11 && card.number <= 19) || (card.number >= 31 && card.number <= 39) ? "top-bottom-hotel" : null}`} alt="hotel" src={card.owner === 0 ? blueHotel : card.owner === 1 ? greenHotel : card.owner === 2 ? yellowHotel : redHotel}></img>
                    : Array.from({ length: card.houses }).map((house, i) => {
                        return <img key={i} className={`house ${(cardNumber >= 11 && card.number <= 19) || (card.number >= 31 && card.number <= 39) ? "top-bottom-house" : null}`} alt="house" src={card.owner === 0 ? blueHouse : card.owner === 1 ? greenHouse : card.owner === 2 ? yellowHouse : redHouse}></img>
                    }) : null}
            </div>
            <p>{card.pokemon.cost}$</p>
        </div>
    )
}
