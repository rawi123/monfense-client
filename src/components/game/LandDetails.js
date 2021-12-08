import React from 'react'
import { Card, CardActions, CardContent, Typography } from '@mui/material'

export default function LandDetails({ pokemon, classToPut }) {
    return (
        <Card className={` ${classToPut} land-details land-${pokemon.color} ${pokemon.name === "pikachu" ? "pikachu" : null}`} sx={{ maxWidth: 450, display: "flex", alignItems: "center", flexDirection: "column" }}>
            <Typography style={{ width: "100%", alignSelf: "start", fontSize: "1.2rem", color: "white" }} gutterBottom component="div" className="flex column">
                <strong><p>{pokemon.name}</p> <p>upgrade Cost: {parseInt(pokemon.cost * 0.4)}$</p></strong>
            </Typography>
            <img
                height="100"
                src={require(`../../sprites-animations/${pokemon.name}-front.gif`).default}
                alt={pokemon.name||"pokemon"}
            />
            <CardContent>
                <Typography variant="body2" color="white" >
                    <strong>attack:{pokemon.attack}🗡️</strong>
                </Typography>
                <Typography variant="body2" color="white" >
                    <strong>defense:{pokemon.def}🛡️</strong>
                </Typography>
                <Typography variant="body2" color="white" >
                    <strong>hp:{pokemon.hp}❤️</strong>
                </Typography>
                <Typography variant="body2" color="white" >
                    <strong>one house:{parseInt(pokemon.cost * 0.1)}$</strong>
                </Typography>
                <Typography variant="body2" color="white" >
                    <strong>two house:{parseInt(pokemon.cost * 0.3)}$</strong>
                </Typography>
                <Typography variant="body2" color="white" >
                    <strong>hotel:{parseInt(pokemon.cost * 0.8)}$</strong>
                </Typography>
            </CardContent>
            <CardActions>
            </CardActions>
        </Card>

    )
}
