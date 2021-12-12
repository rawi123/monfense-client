import React from 'react'
import store from "../../images/store.png";
export default function StoreLand() {
    return (
        <>
            <p style={{position:"absolute"}}>Store</p>
            <img alt="store" className="full" src={store}></img>
        </>
    )
}
