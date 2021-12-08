import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import pokeBall from "../images/pokeball.png"
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../api/userApi";
import { useNavigate } from 'react-router';
import { setUser } from "../redux/slices/userSlices"
import {Link} from "react-router-dom";
export default function Nav() {
    const user = useSelector(state => state?.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handelLogout = async () => {
        try {
            await logout();
            dispatch(setUser({ user: null }))
            navigate("/")
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <Box  sx={{ position: "absolute",minWidth:"40vw" }}>
            <AppBar position="static" sx={{ background: "#AE0907" }}>
                <Toolbar className="nav-bar">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <div className="flex space-between" style={{ width: "40%" }}>
                            <p>{user.user?.username}</p>
                            <p>{user.user?.money}$</p>
                        </div>
                    </Typography>
                    <Button color="inherit">
                        <img className="pokeball" src={pokeBall} alt="pokeball"></img>
                    </Button>
                    <Button component={Link} to="/game" color="inherit">
                        Home
                    </Button>
                    <Button color="inherit" onClick={handelLogout}>
                        Log out
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

