import React from 'react'
import PokeCard from './PokeCard'
import "./style.css"
import { useSelector } from 'react-redux'
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';

export default function Store({ classToPut, setStore, userProp,handelBuyProp }) {
    const { pokemons } = useSelector(state => state?.pokemons);
    const { user } = useSelector(state => state?.user);

    const closeStore = () => {
        setStore("none")
    }

    return (
        <div className={`flex column ${classToPut}`}>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={closeStore} />
            <div className="card-header"><h2>Poke Store</h2></div>
            <div className="store-items">
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {pokemons ?
                        userProp ? pokemons.filter(val => userProp.pokemons.every(ownVal => ownVal._id !== val._id))
                            .map(pokemon => <PokeCard handelBuyProp={handelBuyProp} userProp={userProp} key={pokemon._id} pokemon={pokemon} />) :
                            pokemons.filter(val => user?.pokemons.every(ownVal => ownVal._id !== val._id))
                                .map(pokemon => <PokeCard key={pokemon._id} pokemon={pokemon} />)
                        : null}
                </Grid>
            </div>
        </div>
    )
}
