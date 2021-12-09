import React from 'react'
import tax from "../../images/prize.png"
import prize from "../../images/prize.jfif"

export default function TaxPrize({card}) {
    return (
        <div>
            {card==="tax"?<img src={tax} alt="tax" className="full"></img>:<img src={prize} alt="prize" className="full"></img>}
        </div>
    )
}
