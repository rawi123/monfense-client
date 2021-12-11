import React from 'react'
import "./style.css"
export default function Loader() {
    return (
        <div>
            <><section className='loader'>
                <div className="block block1"></div>
                <div className="block block2"></div>
                <div className="block block3"></div>
            </section>
                <section className='loader'>
                    <div className="block block1"></div>
                    <div className="block block2"></div>
                    <div className="block block3"></div>
                </section>
            </>
        </div>
    )
}
