import React from 'react'
import tax from "../../images/tax.png"
import tax1 from "../../images/tax1.png"
import prize from "../../images/prize.jfif"

export default function TaxPrize({ card, cardNumber }) {
    return (
        <> {card === "tax" ? <img src={(cardNumber >= 1 && cardNumber <= 9) || (cardNumber >= 21 && cardNumber <= 29) ? tax1 : tax} alt="tax" className="full"></img> : <img src={prize} alt="prize" className="full"></img>}</>
    )
}
