import axios from 'axios';

const app = axios.create({
    baseURL: process.env.REACT_APP_URL,
    headers: { Authorization: localStorage.getItem("token")?`Bearer ${localStorage.getItem("token")}` : null }
});


export const getPokemons = async () => {
    try {
        const res = await app.get('/pokemon/get-pokemons');
        return res.data;
    }
    catch (err) {
        throw (err)
    }
}
