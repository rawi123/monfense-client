import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import BackPack from '../Store/BackPack';

export default function PlayersCards({ players, currentPlayer, haveToSell, turn }) {
    const { user } = useSelector(state => state.user);
    const [backpack, setBackPack] = useState("none-absoulute");
    const [classPut, setClassPut] = useState("player-card");

    useEffect(() => {
        if (haveToSell && turn === currentPlayer.number) {
            setClassPut("player-card-backwards")
            setTimeout(() => setClassPut("player-card"), 3000)
        }// eslint-disable-next-line
    }, [haveToSell])

    return (<>
        {players.map((val, i) => {
            if (val.number === currentPlayer.number) {
                return (<div key={val.socketId}>
                    <BackPack userProp={currentPlayer} classToPut={backpack} setStore={setBackPack} />
                    <div style={{
                        background: val.number === 0 ? "blue" : val.number === 1 ? "yellow" : val.number === 2 ? "red" : "greem",
                        border: val.number === 0 ? "4px solid blue" : val.number === 1 ? "4px solid yellow" : val.number === 2 ? "4px solid red" : "4px solid greem"
                    }} className={`flex center column ${classPut} player-card${i}`}>
                        <h4>{user ? user.username : "YOU"} </h4>
                        <h3>player: {val.number + 1} </h3>
                        <hr />
                        <Button onClick={() => setBackPack("store")}>Open Backpack</Button>
                        money:{currentPlayer.money}$
                    </div>
                </div>
                )
            }
            if (!val.number && val.number !== 0)
                return "";
            return (
                <div style={{
                    background: val.number === 0 ? "blue" : val.number === 1 ? "yellow" : val.number === 2 ? "red" : "greem",
                    border: val.number === 0 ? "4px solid blue" : val.number === 1 ? "4px solid yellow" : val.number === 2 ? "4px solid red" : "4px solid greem"
                }}
                    key={val.socketId} className={`flex center column player-card player-card${i}`} >
                    <h3>player: {val.number + 1}</h3>
                    <hr />
                    money:{val.money}$
                </div>
            )
        })}
    </>
    )
}