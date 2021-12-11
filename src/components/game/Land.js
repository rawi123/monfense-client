import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import playerBlue from "../../images/blue_piece.png";
import playerYellow from "../../images/yellow_piece.png";
import playerRed from "../../images/red_piece.png";
import playerGreen from "../../images/green_piece.png";

export default function Land({ classGive, cardNumber, children, haveToSell }) {
    const [arr] = useState([0, 10, 20, 30]);
    const { currentPlayer } = useSelector(state => state.currentPlayer);
    const { players } = useSelector(state => state?.players);

    return (
        <div className={`${classGive} land flex flex-start ${arr.includes(cardNumber) ? "center" : null}`} >
            <div className={` poke-card `}>
                {haveToSell ? <div className="black-screen"></div> : null}

                {children}
                {players?.map(val => {
                    if (val.pos === cardNumber) {
                        return <img alt="img" key={val.socketId} src={val.number === 0 ? playerBlue : val.number === 1 ? playerYellow : val.number === 2 ? playerRed : playerGreen}
                            className={`soldier player${val.number}`} style={{ background: val.number === currentPlayer.number ? "green" : null }}></img>
                    }
                    return null;
                })}
            </div>
        </div>
    )
}
