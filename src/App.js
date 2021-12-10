import React, { useEffect } from "react";
import "./app.css"
import { useDispatch } from "react-redux";
import { fetchUser } from "./redux/slices/userSlices";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Homepage from "./components/homepage/HomePage";
import Signup from "./components/login-signup/Signup";
import Signin from "./components/login-signup/Signin";
import Menu from "./components/Menu";
import WaitingRoom from "./components/waitingRoom/WaitingRoom";
import socket from "./api/socket";
import BoardContainer from "./components/game/BoardContainer";
import {setSocketEnabled} from "./redux/slices/socketRunSlices";
import { getPokemons } from "./api/pokemonApi";
import { setPokemons } from "./redux/slices/pokemonSlices";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("connect",()=>{
      dispatch(setSocketEnabled(true))
    })
    if (localStorage.getItem("token")) {
      dispatch(fetchUser())
    }
    (async ()=>{
      const pokemons = await getPokemons();
      dispatch(setPokemons({ pokemons }))
    })()

    // eslint-disable-next-line
  }, [])


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/game" element={<Menu />} />
        <Route path="/game-playing-online" element={<BoardContainer />} />
        <Route path="/game-online" element={<WaitingRoom />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


// setImg1(`./sprites-animations/${pokes.name}-front.gif`)
// {imgUrl1?<img src={require(`${imgUrl1}`).default}></img>:null}