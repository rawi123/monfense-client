import React from 'react'
import "./homepage.css"
import logo from "../../images/logo.png"
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlices';
import { useNavigate } from 'react-router';
import { login } from '../../api/userApi';

export default function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signGuest = async () => {
        try {
            const user = await (login({ username: "Guest", password: "Guest" }));// eslint-disable-next-line 
            if (!user) throw ("")
            dispatch(setUser({ user, decline: false }))
            navigate("/game")
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="menu-container">
            <div className="flex center">
                <img src={logo} alt="logo" className="logo"></img>
            </div>
            <div className="flex center column ">
                <Button component={Link} to="/signin" variant="contained" sx={{
                    mt: "5%", width: "25%", height: "8vh", background: "#AE0907", '&:hover': { backgroundColor: '#5C3250' }
                }}>
                    Sign In
                </Button>
                <Button component={Link} to="/signup" variant="contained" sx={{
                    mt: "4%", width: "25%", height: "8vh", background: "#AE0907", '&:hover': { backgroundColor: '#5C3250' }
                }}>
                    Sign Up
                </Button>
                <Button onClick={signGuest} variant="contained" sx={{
                    mt: "4%", width: "25%", height: "8vh", background: "#AE0907", '&:hover': { backgroundColor: '#5C3250' }
                }}>
                    Play as a guest
                </Button>
            </div>
        </div>
    )
}
