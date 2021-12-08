import React from 'react'
import jail from "../../images/jail.jpg";
import go from "../../images/go.png";

export default function JailLand({ card }) {
    return (
        <>
            <img alt="jail or go" className="full" src={card=== "go" ? go : jail}></img>
            <p style={{position:"absolute",background:"white"}}>{card==="jail"?"jail":null}</p>
        </>
    )
}
