import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "./style.css"
import { Button } from '@mui/material';
import socket from "../../api/socket";
import Room from './Room';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setCurrentPlayer } from "../../redux/slices/currentPlayerSlices"
import { addPlayer } from "../../redux/slices/playersSlices";
import { addAction } from '../../redux/slices/socketActionsSlices';
import { setPlayers } from "../../redux/slices/playersSlices"
import { setRoom } from "../../redux/slices/roomSlices"
import Nav from "../Nav";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



export default function WaitingRoom() {
    const [rooms, setRooms] = React.useState([]);
    const [tableClass, setTableClass] = React.useState("");
    const [currentRoom, setCurrentRoom] = React.useState("");
    const [roomData, setRoomData] = React.useState([]);
    const [images] = React.useState(['blue', 'yellow', 'red', 'green']);
    const { pokemons } = useSelector(state => state.pokemons);
    const { user } = useSelector(state => state.user);
    const { actions } = useSelector(state => state.socketActions);
    const { players } = useSelector(state => state.players);
    const { room } = useSelector(state => state.room);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    React.useEffect(() => {//update rooms

        socket.emit("get-rooms");
        socket.on("return-rooms", (rooms) => {
            setRooms(rooms)
        })
        socket.on("add-player", (player) => {
            dispatch(addPlayer({ player }))
        })
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {//only when added all players in right place start game
        const sum = [...players].reduce((sum, val) => sum = val ? sum + 1 : sum, 0);
        console.log(roomData, sum)
        if (roomData.length && sum === roomData.length) {
            navigate("/game-playing-online");
            socket.emit("set-players", players, room);
        }
        // eslint-disable-next-line
    }, [players])

    React.useEffect(() => {//play game set all players in redux state navigate to game and add the relevant pokemons
        dispatch(setPlayers({ players: [] }));
        if (!actions.includes("play-game") && user && pokemons) {
            dispatch(addAction("play-game"));
            socket.on("play-game", (roomData, roomName) => {
                setRoomData(roomData);
                dispatch(setRoom(roomName));
                roomData.map((val, i) => {
                    const player = { number: i, img: images[i], pos: 0, socketId: val, pokemons: [], ownedLands: [], money: 15000, jail: false };
                    if (socket.id === val) {
                        player.pokemons = [...user.pokemons.map(val => { return { ...val, roundsPassed: 0 } })];
                        if (player.pokemons.length === 0) {
                            player.pokemons = addRandomPokemon();
                        }
                        dispatch(setCurrentPlayer({ currentPlayer: player }));
                        socket.emit("add-player", roomName, player);
                    }
                    return 1;
                })

            })
        }// eslint-disable-next-line
    }, [user, pokemons])

    const addRandomPokemon = () => {
        const pokemonsUnder10k = pokemons.filter(pokemon => pokemon.cost < 10000);
        return [{ ...pokemonsUnder10k[Math.floor(Math.random() * pokemonsUnder10k.length)], roundsPassed: 1 }];
    }

    const createRoom = async () => {//create new room
        socket.emit("leave-last-room");
        socket.emit('create', (room) => {
            displayRoom(room);
        });
    }

    const joinRoom = (roomNumber) => {//join a room
        try {
            socket.emit("join-room", roomNumber, (room) => {
                displayRoom(room);
            });
        }
        catch (err) {
            console.log(err)
        }

    }

    const displayRoom = (roomNumber) => {//display room - show the component
        setCurrentRoom(roomNumber);
        setTableClass("none-absoulute");
    }

    return (<>
        <Nav></Nav>
        <div className="waiting-room">
            <div className="waiting-room-container flex column ">
                {tableClass === "none-absoulute" ? <div className={`room-container relative`}>
                    <Room roomProp={currentRoom} setTableClass={setTableClass} />
                </div> : null}
                <TableContainer className={`relative ${tableClass}`} component={Paper}>
                    <Table sx={{ minWidth: 400 }} aria-label="customized table" className="rooms waiting-table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Room</StyledTableCell>
                                <StyledTableCell align="right">Plyaers</StyledTableCell>
                                <StyledTableCell align="right">join</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rooms.map((room) => (//room[0] is room name room[1] is the players array

                                <StyledTableRow key={room[0]}>
                                    <StyledTableCell component="th" scope="row">
                                        {room[0]}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{room[1].length}/4</StyledTableCell>
                                    <StyledTableCell align="right"><Button onClick={() => joinRoom(room[0])} variant="contained" sx={{ background: "#000000", opacity: 0.9, '&:hover': { backgroundColor: '#5EC1F0' } }}>Join</Button></StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button onClick={createRoom} variant="contained" sx={{ background: "#000000", position: "absolute", width: "100%", bottom: "0", '&:hover': { backgroundColor: '#5EC1F0' } }}>Create Room</Button>
                </TableContainer>
            </div>
        </div>
    </>
    );
}