import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Alert from '@mui/material/Alert';
import { buyPokemon } from '../../api/userApi';
import { setUser } from "../../redux/slices/userSlices"

export default function PokeCard({ pokemon, removeBuy, userProp, handelBuyProp }) {
    const { user } = useSelector(state => state?.user);
    const dispatch = useDispatch();
    const [err, setErr] = useState(false);
    const [enableBuy, setEnableBuy] = useState(true);

    const error = () => {
        setErr(true);
        setTimeout(() => {
            setErr(false);
        }, 2000);
    }

    const handelBuy = async () => {
        try {
            if (!enableBuy) {
                return
            }
            setEnableBuy(false);
            console.log("buy")
            if (user.money < pokemon.cost) {
                error();
                return;
            }
            const newUser = await buyPokemon(pokemon._id);
            dispatch(setUser({ user: newUser, decline: false }));
        }
        catch (err) {
            error();
            setEnableBuy(true);
        }
    }

    return (
        <Grid item xs={2} sm={4} md={4}>
            <Card className="single-poke-card">
                <img
                    height="100"
                    src={require(`../../sprites-animations/${pokemon.name}-front.gif`).default}
                    alt={pokemon.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {pokemon.name}
                    </Typography>
                    <Typography variant="body2">
                        <strong> attack:{pokemon.attack}</strong>
                    </Typography>
                    <Typography variant="body2">
                        <strong> defense:{pokemon.def}</strong>
                    </Typography>
                    <Typography variant="body2">
                        <strong> hp:{pokemon.hp}</strong>
                    </Typography>
                </CardContent>
                <CardActions>
                    {pokemon.cost}${!removeBuy ? 
                    <Button className="buy-button"  size="small" sx={{color:"black"}} onClick={() => handelBuyProp ? handelBuyProp(pokemon, error) : handelBuy()}>Buy</Button> : null}
                </CardActions>
            </Card>
            {err ? <Alert sx={{ mt: 3 }} severity="error">Not enough money</Alert> : null}

        </Grid>
    )
}
