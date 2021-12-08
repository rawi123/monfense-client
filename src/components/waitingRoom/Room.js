import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material';
import socket from '../../api/socket';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from "react-redux";
import { addAction } from '../../redux/slices/socketActionsSlices';


export default function Room({ roomProp, setTableClass }) {
    const [room, setRoom] = useState(roomProp)
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const { user } = useSelector(state => state?.user);
    const { actions } = useSelector(state => state.socketActions);
    const divRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on("roomUpdate", (newRoom) => {
            setRoom(newRoom);
        })

        if (!actions.includes("recive-message")) {
            dispatch(addAction("recive-message"))
            socket.on("recive-message", (message, user) => {
                setMessages(messages => [...messages, message]);
            })
        }

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        divRef.current.scrollTop = divRef.current.scrollHeight;

    })

    const sendMessage = () => {
        if (input === "") return
        socket.emit("send-message", { message: input, socket: socket.id, sender: user.username }, room[0]);
        setMessages([...messages,])
        setInput("");
    }

    const leaveRoom = () => {
        socket.emit("leave-room", room[0]);
        setTableClass("");
    }

    const startGame = () => {
        // if (room[1].length >= 2)
        socket.emit("start-game", room[0])
    }

    return (
        <>
            <div className="flex center column room-number">
                <h2 >{room[0]}</h2>
                <h2 >{room[1].length}/4</h2>
            </div>
            <Button onClick={leaveRoom} variant="contained" sx={{ background: "#000000", position: "absolute", width: "100%", bottom: "0", '&:hover': { backgroundColor: '#5EC1F0' } }}>Leave Room</Button>
            <Grid className="message-room" >
                <List ref={divRef} className="send-message" sx={{ height: "80%" }}>
                    {messages.map((val, i) => <ListItem key={i}>
                        <article className={`msg-container  ${socket.id === val.socket ? "msg-self" : "msg-remote"}`} id="msg-0">
                            <div className="msg-box">
                                <div className="flr">
                                    <div className="messages">
                                        <p className="msg" id="msg-1">
                                            {val.message}
                                        </p>
                                    </div>
                                    <span className="timestamp"><span className="username">{val.sender}</span>&bull;</span>
                                </div>
                                <img alt="person img" className="user-img" id="user-0" src="//gravatar.com/avatar/56234674574535734573000000000001?d=retro" />
                            </div>
                        </article>
                    </ListItem>)}
                </List>
                <Divider />
                <Grid container className="message-row">
                    <Grid item xs={11}>
                        <TextField onKeyDown={(e) => { if (e.code === "Enter") sendMessage() }} id="outlined-basic-email" label="Type Something" value={input} fullWidth onChange={(e) => setInput(e.target.value)} />
                    </Grid>
                    <Grid item xs={1} align="right">
                        <Fab onClick={sendMessage} color="primary" aria-label="add"><SendIcon /></Fab>
                    </Grid>
                </Grid>
            </Grid>
            {socket.id === room[1][0] ? <Button onClick={startGame} variant="contained" style={{ background: "#000000", width: "100%", opacity: 0.9, color: "white" }}>Play</Button> : null}

        </>
    )
}
