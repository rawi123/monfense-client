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
import { wait, updatePlayerPos, playTurn, setFreeFromJail, nextTurn, pay, sellPlayerHouses, checkWin } from './boradFunctionality/boardFunctionality';
import MessageDisplay from './MessageDisplay';
import Play from './Play';
import { lostGame, winGame } from '../../api/userApi';
import { setUser } from '../../redux/slices/userSlices';

export default function BoardContainer() {
    const navigate = useNavigate(),
        { turn } = useSelector(state => state.turn),
        { currentPlayer } = useSelector(state => state.currentPlayer),
        { players } = useSelector(state => state.players),
        { socketEnabled } = useSelector(state => state.socketEnabled),
        { pokemons } = useSelector(state => state.pokemons),
        { actions } = useSelector(state => state.socketActions),
        { user } = useSelector(state => state.user),
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
        if (currentPlayer && 0 === currentPlayer.number) setEnableDice(true);

        socket.emit("socket-room", room => {
            if (room[0].slice(0, 4) !== "room") {
                navigate("/game")
            }
        })
        // return (() => {
        //     socket.emit("socket-room", room => {
        //         socket.emit("leave-room", room);
        //         window.location.reload(false);
        //     })
        // })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (actions.length && cards.length && socketEnabled && !actions.includes("player-move") && !actions.includes("next-turn")) {
            socket.on("player-move", (oldPos, sum, turn, players, updatedPlayers, diceArr, cardsProp) => {
                setDiceRoll(diceArr);
                setPlayerPlayingTurn(turn);
                setCards(cardsProp);

                if (turn !== currentPlayer.number) {
                    setRoll(diceArr);
                    setTimeout(() => {
                        setRoll([])
                    }, 4000);
                }

                walk(oldPos, sum, turn, players, updatedPlayers, diceArr, cardsProp);
            })

            socket.on("next-turn", async (turn, players, cards) => {

                const currentFind = players.find(val => val.number === currentPlayer.number)
                dispatch(setCurrentPlayer({ currentPlayer: currentFind }))
                setCurrentCard({ card: "" });
                if (checkWin(players, turn, currentPlayer, setCurrentCard)) {
                    setCurrentCard({ card: "win" })
                    await wait(3000);
                    if (user.username !== "guest") {
                        const data = await winGame(user);
                        dispatch(setUser({ user: data }));
                    }
                    navigate("/game");
                }

                else {
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
                }


                dispatch(setTurn(turn))
                dispatch(setPlayers({ players }))
            })
            dispatch(addActions(["next-turn", "player-move"]))
        }
        // eslint-disable-next-line
    }, [actions, cards])



    const rolledDice = async (sum, dicesArr) => {
        setEnableDice(false);
        setEnablePlay(false);

        const oldPos = currentPlayer.pos,
            newPos = (oldPos + sum) % 40,//
            currentPlayerTemp = { ...currentPlayer, pos: newPos, money: (oldPos + sum) >= 40 ? currentPlayer.money + 2000 : currentPlayer.money },
            updatedPlayers = playTurn([...players], turn, newPos, cards, pokemons);

        socket.emit("player-move", oldPos, sum, turn, players, updatedPlayers, dicesArr, cards);
        dispatch(setCurrentPlayer({ currentPlayer: currentPlayerTemp }));
    }

    const walk = async (oldPos, sum, turn, players, updatedPlayers, diceArr, cardsProp) => {
        let newPlayers;

        for (let i = 1; i <= sum; i++) {
            await wait(300);
            newPlayers = updatePlayerPos(players, turn, i, oldPos);
            dispatch(setPlayers({ players: newPlayers }));
        }

        turnPlay(updatedPlayers, turn, diceArr, cardsProp);
    }


    const turnPlay = async (updatedPlayers, turn, diceArr, cardsProp) => {

        if (!updatedPlayers.lost)
            setCurrentCard(updatedPlayers);
        else {
            setCurrentCard({ card: `lost`, player: `player ${turn + 1}` });
        }
        console.log(updatedPlayers.payToPlayer);
        let timeOut;

        if (!updatedPlayers.haveToSell &&
            ((typeof (updatedPlayers.card) !== "object" && updatedPlayers.card !== "store") || (typeof (updatedPlayers.card) === "object" && updatedPlayers.payToPlayer!==null)))
            timeOut = setTimeout(() => {
                setCurrentCard({ card: "" })
            }, 4000);

        if (updatedPlayers.haveToSell && turn === currentPlayer.number) {
            setHaveToSell(true);
            setEnablePlay(false);
            setEnableDice(false);
        }

        else if (!updatedPlayers.lost) {
            if (updatedPlayers.canPlayFlag && turn === currentPlayer.number) {
                setEnablePlay(true);
            }

            else {
                dispatch(setPlayers({ players: updatedPlayers.players }));
                if (turn === currentPlayer.number) {
                    dispatch(setCurrentPlayer({ currentPlayer: updatedPlayers.players[turn] }))
                    await wait(3000);
                    endTurn([...updatedPlayers.players], false, turn, diceArr, true, cardsProp);
                }
            }
        }
        else if (currentPlayer.number === turn) {
            const { cardsTemp, playersTempAfterSell, currentPlayerTemp } = sellPlayerHouses(cards, updatedPlayers.players, currentPlayer);
            updatedPlayers.moneyTakeOut = currentPlayerTemp.money;

            const playersTemp = handelPayAfterSell(updatedPlayers, playersTempAfterSell, turn);
            playersTemp.splice(turn, 1);

            setCurrentPlayer({ currentPlayer: null });
            setCurrentCard({ card: "lost" });

            if (user.username !== "guest") {
                const data = await lostGame(user);
                dispatch(setUser({ user: data }));
            }
            await wait(3000);


            navigate("/game");


            endTurn(playersTemp, false, turn, false, false, cardsTemp);
        }
        if (updatedPlayers.lost === true) {
            clearTimeout(timeOut);
        }
    }

    const endTurn = (playersTemp, currentPlayer = false, turnProp, diceArr = false, checkDice = true, cardsTemp = null) => {
        setEnablePlay(false);

        if (!playersTemp) {
            playersTemp = [...players];
            playersTemp[turnProp] = currentPlayer;
            dispatch(setPlayers({ players: playersTemp }));
        }

        nextTurn(socket, diceArr, diceRoll, turnProp, playersTemp, cardsTemp || cards, checkDice);
    }

    const handelPayAfterSell = (updatedPlayers = false, newPlayers = false, turn = false) => {

        if (newPlayers || currentCard.moneyTakeOut <= currentPlayer.money) {
            const { playersTemp, currentPlayerTemp } = pay(newPlayers || players, newPlayers[turn] || currentPlayer, updatedPlayers || currentCard);

            if (!updatedPlayers) {
                dispatch(setPlayers({ players: playersTemp }));
                dispatch(setCurrentPlayer({ currentPlayer: currentPlayerTemp }));
                setCurrentCard({ card: "" });
                setHaveToSell(false);
                endTurn(playersTemp, false, turn);
            }

            else return playersTemp;
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
                {haveToSell ? <Button onClick={() => handelPayAfterSell()}>pay</Button> : null}
            </div>

            <PlayersCards turn={turn} haveToSell={haveToSell} currentPlayer={currentPlayer} players={players}></PlayersCards>

        </div>
    )
}
