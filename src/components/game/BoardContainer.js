import React, { useState, useEffect } from 'react'
import Board from './Board';
import "./style.css";
import { useNavigate } from 'react-router';
import socket from '../../api/socket';
import Dice from "./Dice";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlayer } from "../../redux/slices/currentPlayerSlices";
import { setPlayers } from "../../redux/slices/playersSlices";
import { setTurn } from '../../redux/slices/turnSlices';
import { addActions } from "../../redux/slices/socketActionsSlices";
import PlayersCards from './PlayersCards';
import { Alert, Button } from '@mui/material';
import { wait, updatePlayerPos, playTurn, setFreeFromJail, nextTurn, pay } from './boradFunctionality/boardFunctionality';
import MessageDisplay from './MessageDisplay';
import Play from './Play';

export default function BoardContainer() {
    const navigate = useNavigate(),
        { turn } = useSelector(state => state.turn),
        { currentPlayer } = useSelector(state => state.currentPlayer),
        { players } = useSelector(state => state.players),
        { socketEnabled } = useSelector(state => state.socketEnabled),
        { pokemons } = useSelector(state => state.pokemons),
        { actions } = useSelector(state => state.socketActions),
        [roll, setRoll] = useState([]),
        [cards, setCards] = useState([]),
        [playerPlayingTurn, setPlayerPlayingTurn] = useState(),
        [enablePlay, setEnablePlay] = useState(false),
        [enableDice, setEnableDice] = useState(false),
        [diceRoll, setDiceRoll] = useState([]),
        [currentCard, setCurrentCard] = useState({ card: "", sum: "", rnd: "" }),
        [haveToSell, setHaveToSell] = useState(false),
        dispatch = useDispatch();

    useEffect(() => {
        if (currentPlayer && turn === currentPlayer.number) setEnableDice(true);
        socket.emit("socket-room", room => {
            if (room[0].slice(0, 4) !== "room") {
                navigate("/game")
            }
        })// eslint-disable-next-line
    }, [])


    useEffect(() => {
        if (actions.length && socketEnabled && !actions.includes("player-move") && !actions.includes("next-turn")) {
            socket.on("player-move", (oldPos, sum, turn, players, updatedPlayers, diceArr, cards) => {
                setDiceRoll(diceArr);
                setPlayerPlayingTurn(turn);
                setCards(cards);

                if (turn !== currentPlayer.number) {
                    setRoll(diceArr);
                    setTimeout(() => {
                        setRoll([])
                    }, 4000);
                }

                walk(oldPos, sum, turn, players, updatedPlayers, diceArr, cards);
            })

            socket.on("next-turn", (turn, players, cards) => {
                dispatch(setCurrentPlayer({ currentPlayer: players[currentPlayer.number] }))
                setCurrentCard({ card: "" });

                if (cards.length)
                    setCards(cards)

                if (turn === currentPlayer.number) {
                    if (currentPlayer.jail === true) {
                        const jailFree = setFreeFromJail(players, currentPlayer);
                        dispatch(setCurrentPlayer({ currentPlayer: jailFree.player }))
                        dispatch(setPlayers({ players: jailFree.allPlayers }));
                        socket.emit("next-turn", turn, jailFree.allPlayers);
                    }
                    else setEnableDice(true);
                }

                dispatch(setTurn(turn))
                dispatch(setPlayers({ players }))
            })
            dispatch(addActions(["next-turn", "player-move"]))
        }// eslint-disable-next-line
    }, [actions])

    const rolledDice = async (sum, dicesArr) => {
        setEnableDice(false);
        setEnablePlay(false);

        const oldPos = currentPlayer.pos,
            newPos = (oldPos + sum) % 40,
            currentPlayerTemp = { ...currentPlayer, pos: newPos, money: (oldPos + sum) >= 40 ? currentPlayer.money + 2000 : currentPlayer.money },
            updatedPlayers = playTurn([...players], turn, newPos, cards, pokemons);

        socket.emit("player-move", oldPos, sum, turn, players, updatedPlayers, dicesArr, cards);
        dispatch(setCurrentPlayer({ currentPlayer: currentPlayerTemp }));
    }

    const walk = async (oldPos, sum, turn, players, updatedPlayers, diceArr) => {
        let newPlayers;

        for (let i = 1; i <= sum; i++) {
            await wait(300);
            newPlayers = updatePlayerPos(players, turn, i, oldPos);
            dispatch(setPlayers({ players: newPlayers }));
        }

        turnPlay(updatedPlayers, turn, diceArr);
    }

    const turnPlay = async (updatedPlayers, turn, diceArr) => {
        setCurrentCard(updatedPlayers);
        if (!updatedPlayers.haveToSell && ((typeof (updatedPlayers.card) !== "object" && updatedPlayers.card !== "store") || (typeof (updatedPlayers.card) === "object" && updatedPlayers.payToPlayer))) setTimeout(() => {
            setCurrentCard({ card: "" })
        }, 4000);

        if (updatedPlayers.haveToSell && turn === currentPlayer.number) {
            setHaveToSell(true);
            setEnablePlay(false);
            setEnableDice(false);
        }

        else {
            if (updatedPlayers.canPlayFlag && turn === currentPlayer.number) {
                setEnablePlay(true);
            }

            else {
                dispatch(setPlayers({ players: updatedPlayers.players }));
                if (turn === currentPlayer.number) {
                    dispatch(setCurrentPlayer({ currentPlayer: updatedPlayers.players[turn] }))
                    await wait(3000);
                    endTurn([...updatedPlayers.players], false, turn, diceArr);
                }
            }
        }

    }


    const endTurn = (playersTemp, currentPlayer = false, turnProp, diceArr = false) => {
        setEnablePlay(false);

        if (!playersTemp) {
            playersTemp = [...players];
            playersTemp[turnProp] = currentPlayer;
            dispatch(setPlayers({ players: playersTemp }));
        }

        nextTurn(socket, diceArr, diceRoll, turnProp, playersTemp, cards);
    }

    const handelPayAfterSell = () => {
        if (currentCard.moneyTakeOut <= currentPlayer.money) {
            const { playersTemp, currentPlayerTemp } = pay(players, currentPlayer, currentCard);
            dispatch(setPlayers({ players: playersTemp }));
            dispatch(setCurrentPlayer({ currentPlayer: currentPlayerTemp }));
            setCurrentCard({ card: "" });
            setHaveToSell(false);
            endTurn(playersTemp, false, turn);
        }

    }

    return (
        <div className="board-global-container flex center">

            <div className="board-container">
                <Board cards={cards} setCards={setCards} haveToSell={haveToSell} />
                <MessageDisplay turn={playerPlayingTurn} currentPlayer={currentPlayer} card={currentCard}></MessageDisplay>
            </div>
            <div>
                <div className="flex column">
                    <Dice rolledDice={rolledDice} turn={turn} enableDice={enableDice} currentPlayerTurn={currentPlayer?.number}></Dice>
                </div>
                {enablePlay && currentPlayer.number === turn ? <Play setCards={setCards} cards={cards} endTurn={endTurn} turn={turn} currentPlayer={currentPlayer} card={currentCard}></Play> : null}
                {roll.length ? <Alert sx={{ marginTop: "1rem" }} variant="outlined" severity="success" color="info" icon={false}>player rolled :{roll[0]},{roll[1]}</Alert> : null}
                {haveToSell ? <Button onClick={handelPayAfterSell}>pay</Button> : null}
            </div>

            <PlayersCards turn={turn} haveToSell={haveToSell} currentPlayer={currentPlayer} players={players}></PlayersCards>

        </div>
    )
}
