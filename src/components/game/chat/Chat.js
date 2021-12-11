import React, { useEffect } from 'react'
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../../../api/socket';
import { addAction } from '../../../redux/slices/socketActionsSlices';
import "./style.css";
export default function Chat() {
    const { room } = useSelector(state => state.room);
    const { actions } = useSelector(state => state.socketActions);
    const { currentPlayer } = useSelector(state => state.currentPlayer);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!actions.includes("recive-message-ingame")) {
            socket.on("recive-message-ingame", (msg, id, color) => {
                if (socket.id !== id) {
                    addResponseMessage(`${color}: ${msg}`);
                }
            })
            dispatch(addAction("recive-message-ingame"))
        }// eslint-disable-next-line
    }, [])

    const handleNewUserMessage = (msg) => {
        const color = currentPlayer.number === 0 ? "blue" : currentPlayer.number === 1 ? "yellow" : currentPlayer.number === 2 ? "red" : "green";
        socket.emit("send-message-ingame", msg, room, color);
    }

    return (
        <Widget
            handleNewUserMessage={handleNewUserMessage}
            title="Monofense Chat!"
            subtitle="Online chat with the rivals!"
            resizable={true}
            emojis={true}
        />
    )
}
