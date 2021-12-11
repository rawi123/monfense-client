import axios from 'axios';





export const getUser = async () => {
    try {
        const res = await fetchWithAuth('/user/me', {}, "get");
        return res.data;
    }
    catch (err) {
        throw (err)
    }
}

export const register = async ({ username, password }) => {
    try {
        await fetchWithAuth("/user/register", { username, password }, "post");
        return true;
    }
    catch (err) {
        return false;
    }
}
export const login = async ({ username, password }) => {
    try {
        const res = await fetchWithAuth("/user/login", { username, password }, "post");
        localStorage.setItem("token", res.data.token);
        return res.data.user;
    }
    catch (err) {
        return false;
    }
}


export const logout = async () => {
    try {
        await fetchWithAuth("/user/logout", {}, "post");
        localStorage.removeItem("token");
    }
    catch (err) {
        return false;
    }
}
export const buyPokemon = async (id) => {
    try {
        const res = await fetchWithAuth("/user/add-pokemon/" + id, {}, "post");
        return res.data;
    }
    catch (err) {
        return false;
    }
}

export const lostGame = async (user) => {
    if (user.username !== "Guest") {
        const res = await fetchWithAuth("/user/add-game", {}, "post");
        return res.data;
    }
    return user;
}

export const winGame = async (user) => {
    if (user.username !== "Guest") {
        const res = await fetchWithAuth("/user/add-win", {}, "post");
        return res.data;
    }
    return user;
}

export const scoreBoard = async () => {
    const res = await fetchWithAuth("/user/score-board", {}, "get");
    return res.data;
}


const fetchWithAuth = async (url, data, action) => {
    try {
        switch (action) {
            case "get": {
                return await axios.get(`${process.env.REACT_APP_URL}${url}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
            }
            case "post": {
                return await axios.post(`${process.env.REACT_APP_URL}${url}`, data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
            }
            default: break;
        }

    }
    catch (err) {
        throw (err)
    }
}


