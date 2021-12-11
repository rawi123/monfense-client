import React, { Component } from 'react'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import dice from "../../audio/dice-roll.mp3"

export default class Dice extends Component {
    constructor(props) {
        super(props);
        this.state = { anotherRoll: false };
    }
    diceRolled = (rollSum, dicesArr) => {
        if (dicesArr[0] === dicesArr[1]) {
            this.setState({ anotherRoll: true });
            setTimeout(() => {
                this.setState({ anotherRoll: false });
            }, 2000)
        }
        this.props.rolledDice(rollSum, dicesArr)
    }

    render() {
        return (< >
            <ReactDice
                numDice={2}
                rollDone={(rollSum, dicesArr) => this.diceRolled(rollSum, dicesArr)}
                faceColor={"#EAC292"}
                dotColor={"white"}
                disableIndividual={true}
                ref={dice => this.reactDice = dice}
                rollTime={1.1}
                defaultRoll={1}
            />
            {this.props.turn === this.props.currentPlayerTurn && this.props.enableDice ? <Button sx={{ color: "black", fontWeight: 700, border: "2px solid black" }} onClick={() => {
                let audio = new Audio(dice);
                audio.play();
                this.reactDice.rollAll()
            }}>Roll</Button> : null}
            playing: {this.props.turn === this.props.currentPlayerTurn ? "me" : "player " + (Number(this.props.turn) + 1)}
            {this.state.anotherRoll ? <Alert icon={false} variant="filled" severity="success">Another Roll!</Alert> : null}
        </>
        )
    }
}
