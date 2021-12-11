import React, { useEffect, useState } from 'react'
import logo from "../images/logo.png"
import Button from '@mui/material/Button';
import CasinoIcon from '@mui/icons-material/Casino';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import StoreIcon from '@mui/icons-material/Store';
import Store from './Store/Store';
import BackpackIcon from '@mui/icons-material/Backpack';
import BackPack from './Store/BackPack';
import { setPokemons } from '../redux/slices/pokemonSlices';
import { getPokemons } from '../api/pokemonApi';

export default function Menu() {
    const user = useSelector(state => state?.user);
    const {pokemons}=useSelector(state=>state?.pokemons)
    const [store, setStore] = useState("none-absoulute");
    const [backpack, setBackPack] = useState("none-absoulute");

    const dispatch=useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.decline === true) {
            navigate("/")
        }// eslint-disable-next-line
    }, [user?.decline])

    useEffect(() => {
        if (!pokemons) {
            (async () => {
                const pokemons = await getPokemons();
                dispatch(setPokemons({ pokemons }))
            })()
        }// eslint-disable-next-line 
    }, [pokemons])

    const openStore = () => {
        setStore("store")
    }

    const openBackPack = () => {
        setBackPack("store")
    }
    return (
        <>
            <Store classToPut={store} setStore={setStore} />
            <BackPack classToPut={backpack} setStore={setBackPack} />
            <Nav></Nav>
            <div className="menu-container">
                <div className="flex center">
                    <img src={logo} alt="logo" className="logo"></img>
                </div>
                <div className="flex center column ">
                    <Button component={Link} to="/game-online" variant="contained" endIcon={<CasinoIcon sx={{ transform: "rotate(45deg)" }} />} sx={{
                        mt: "5%", width: "25%", height: "8vh", background: "#AE0907", '&:hover': { backgroundColor: '#5C3250' }
                    }}>
                        Play Online
                    </Button>
                    <Button component={Link} to="/score-board" variant="contained" endIcon={<CasinoIcon />} sx={{
                        mt: "4%", width: "25%", height: "8vh", background: "#AE0907", '&:hover': { backgroundColor: '#5C3250' }
                    }}>
                        Score board
                    </Button>
                    {user.user?.username !== "Guest" ? <><Button variant="contained" endIcon={<StoreIcon />} onClick={openStore} sx={{
                        mt: "4%", width: "25%", height: "8vh", background: "#AE0907", '&:hover': { backgroundColor: '#5C3250' }
                    }}>
                        Store
                    </Button>
                        <Button variant="contained" endIcon={<BackpackIcon />} onClick={openBackPack} sx={{
                            mt: "4%", width: "25%", height: "8vh", background: "#AE0907", '&:hover': { backgroundColor: '#5C3250' }
                        }}>
                            My Pokemons
                        </Button></> : null}
                </div>
            </div>
        </>
    )
}