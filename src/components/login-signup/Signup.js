import "./style.css"
import React, { useState } from 'react'
import logo from "../../images/logo-gray.png"
import { register } from "../../api/userApi"
import Alert from '@mui/material/Alert';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

export default function Signup() {
    const [input, setInput] = useState({
        username: "",
        password: "",
        repPassword:""
    })
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handelSignUp = async () => {
        if (!input.username || !input.password || input.username.length < 3 || input.password.length < 3) {
            setErr("Error! Username and password must be more than 3 letters long");
            return;
        }
        if (input.repPassword!==input.password) {
            setErr("Error! password does not match!");
            return;
        }
        if (await register(input)) {
            setErr("Success!");
            navigate("/signin")
            return;
        }
        setErr("Error! email taken")

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
                    <input autoComplete="off" type="password" name="repPassword" placeholder="Repeat password..." onChange={(e) => {
                        setInput({ ...input, [e.target.name]: e.target.value });
                        if (err) setErr(false);
                    }} />
                    <input type="button" value="Sign Up" onClick={handelSignUp} />
                    <div className="flex space-between">
                        <Link to="/" className="link" >Home</Link>
                        <Link to="/signin" className="link" >Sign In</Link>
                    </div>
                    {err ? <Alert sx={{ mt: 3 }} severity={err.slice(0, 5) === "Error" ? "error" : "success"}>{err}</Alert> : null}
                </form>

            </div>
        </div>
    )
}
