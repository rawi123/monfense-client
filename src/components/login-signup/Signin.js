import "./style.css"
import React, { useState } from 'react'
import logo from "../../images/logo-gray.png"
import { login } from "../../api/userApi"
import Alert from '@mui/material/Alert';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';
import { setUser } from "../../redux/slices/userSlices"
export default function Signin() {
    const [input, setInput] = useState({
        username: "",
        password: ""
    })
    const [err, setErr] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handelSignIn = async () => {
        try {
            if (!input.username || !input.password || input.username.length < 3 || input.password.length < 3) {
                setErr("Error! Username and password must be more than 3 letters long");
                return;
            }
            const user = await (login(input));//eslint-disable-next-line
            if (!user) throw ("")
            dispatch(setUser({ user, decline: false }))
            navigate("/game")
        }
        catch (err) {
            setErr("Error!")
        }
    }

    return (
        <div className="container">
            <div className="form">
                <form>
                    <div className="flex center"><img className="logo" alt="logo" src={logo}></img></div>
                    <input autoComplete="off" type="text" name="username" placeholder="Username..." onChange={(e) => {
                        setInput({ ...input, [e.target.name]: e.target.value });
                        if (err) setErr(false);
                    }} />
                    <input autoComplete="off" type="password" name="password" placeholder="Password..." onChange={(e) => {
                        setInput({ ...input, [e.target.name]: e.target.value });
                        if (err) setErr(false);
                    }} />
                    <input type="button" value="Sign In" onClick={handelSignIn} />
                    <div className="flex space-between">
                        <Link to="/" className="link" >Home</Link>
                        <Link to="/signup" className="link" >Sign up</Link>
                    </div>

                    {err ? <Alert sx={{ mt: 3 }} severity={err.slice(0, 5) === "Error" ? "error" : "success"}>{err}</Alert> : null}
                </form>

            </div>
        </div>
    )
}
