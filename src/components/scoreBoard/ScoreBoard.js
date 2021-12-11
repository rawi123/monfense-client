import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Nav from "../Nav";
import Loader from './Loader';
import { scoreBoard } from '../../api/userApi';

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

export default function ScoreBoard() {
    const [usersBoard, setUsersBoard] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            let board = await scoreBoard();
            board.sort((a, b) => b.gameWon - a.gameWon);
            setUsersBoard(board);
        })()
    }, [])



    return (<>
        <Nav></Nav>
        <div className="waiting-room">
            <div className="waiting-room-container flex column " style={{ width: "83%" }}>
                {!usersBoard.length ? <Loader /> : null}
                <TableContainer component={Paper} style={{ minHeight: 400, background: "#B5B5B5" }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell >Username</StyledTableCell >
                                <StyledTableCell align="right">Games Played</StyledTableCell >
                                <StyledTableCell align="right">Games Won</StyledTableCell >

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usersBoard.map((user) => (
                                <StyledTableRow key={user.username}>
                                    <StyledTableCell component="th" scope="row">
                                        {user.username}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{user.gamesPlayed}</StyledTableCell>
                                    <StyledTableCell align="right">{user.gameWon}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    </>
    );
}