

export const updatePlayerPos = (players, turn, i, oldPos) => {
    const newPlayers = [...players];
    newPlayers[turn] = { ...newPlayers[turn], pos: (oldPos + i) % 40, money: (oldPos + i) >= 40 ? newPlayers[turn].money + 2000 : newPlayers[turn].money };
    return newPlayers;
}

export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const playTurn = (players, turn, newPos, cards, pokemons) => {
    const playerCurrent = { ...players[turn] };
    const avilablePokemons = playerCurrent.pokemons.length === 24 ? [] : returnAvilablePokemons(playerCurrent, pokemons);
    const rnd = avilablePokemons.length > 0 ? Math.floor(Math.random() * 10 + 1) : Math.floor(Math.random() * 11 + 1);

    let moneyTakeOut = Math.floor(Math.random() * (1501 - 300) + 300);
    let canPlayFlag = false;
    let haveToSell = false;
    let lost = false;
    let payToPlayer = null;


    if (typeof cards[newPos] === "object") {
        const landCard = cards[newPos];
        if (landCard.owner !== null && landCard.owner !== playerCurrent.number) {
            let landOwner = { ...players[landCard.owner] };
            let multiply = 1;

            if (checkColorOwned(cards, landCard.owner, landCard.pokemon.color) === 3) //if player have all 3 colored lands 10% more
                multiply = 1.1;

            if (landCard.houses === 1)
                moneyTakeOut = landCard.pokemon.cost * 0.1;
            if (landCard.houses === 2)
                moneyTakeOut = landCard.pokemon.cost * 0.3;
            if (landCard.houses === 3)
                moneyTakeOut = landCard.pokemon.cost * 0.8;

            moneyTakeOut *= multiply;
            moneyTakeOut = parseInt(moneyTakeOut);
            payToPlayer = landCard.owner;

            if (playerCurrent.money < moneyTakeOut) {
                const assetsValue = valuateAssets(cards, playerCurrent);
                if (moneyTakeOut > assetsValue)
                    lost = true;

                else haveToSell = true;
            }

            else {
                playerCurrent.money -= moneyTakeOut;
                landOwner.money += moneyTakeOut;
                players[landCard.owner] = landOwner;
            }
        }

        else
            canPlayFlag = true;
    }

    else if (cards[newPos] === "tax") {
        if (playerCurrent.money > moneyTakeOut) {
            playerCurrent.money -= moneyTakeOut;
        }
        else {
            const assetsValue = valuateAssets(cards, playerCurrent);

            if (moneyTakeOut > assetsValue)
                lost = true;

            else haveToSell = true;
        }
    }

    else if (cards[newPos] === "prize")
        playerCurrent.money += moneyTakeOut;

    else if (cards[newPos] === "card") {
        if (rnd <= 7) {
            moneyTakeOut = parseInt(moneyTakeOut * 0.8);
            if (playerCurrent.money > moneyTakeOut) {
                playerCurrent.money -= moneyTakeOut;
            }
            else {
                const assetsValue = valuateAssets(cards, playerCurrent);
                if (moneyTakeOut > assetsValue) {
                    lost = true;
                }
                else haveToSell = true;
            }
        }

        else if (rnd <= 11)
            playerCurrent.money += moneyTakeOut

        else if (rnd === 12)
            playerCurrent.pokemons = [...playerCurrent.pokemons, avilablePokemons[Math.floor(Math.random() * avilablePokemons.length)]];

    }
    else if (cards[newPos] === "jail") {
        playerCurrent.jail = true;
    }

    else if (cards[newPos] === "store") {
        canPlayFlag = true;
    }
    moneyTakeOut = parseInt(moneyTakeOut);
    playerCurrent.pos = newPos;
    players[turn] = playerCurrent;
    return { canPlayFlag, players, card: cards[newPos], moneyTakeOut, rnd, payToPlayer, haveToSell, pos: newPos, lost };
}




const valuateAssets = (cards, currentPlayer) => {
    return (cards.reduce((sum, val) => {
        if (typeof val === "object" && val.owner === currentPlayer.number) {
            sum += parseInt(val.pokemon.cost * 0.5) * val.houses;
        }
        return sum;
    }, 0) + currentPlayer.money)
}







export const checkColorOwned = (cards, owner, color) =>
    cards.reduce((sum, val) => {
        if (typeof val === "object") {
            if (val.pokemon.color === color && val.owner === owner)
                sum++;
        }
        return sum;
    }, 0)


export const returnAvilablePokemons = (currentPlayer, pokemons) => {
    const avilablePokes = pokemons.filter(pokemon => currentPlayer.pokemons.every(val => val._id !== pokemon._id));
    return avilablePokes;
}

export const setFreeFromJail = (allPlayers, player) => {
    const allPlayersTemp = [...allPlayers];
    const playerTemp = { ...player };
    playerTemp.jail = false;
    allPlayersTemp[player.number] = playerTemp;
    return { allPlayers: allPlayersTemp, player: playerTemp }
}

export const nextTurn = (socket, diceArr, diceRoll, turnProp, playersTemp, cards, checkDice) => {
    if (!checkDice) {
        socket.emit("next-turn", turnProp, playersTemp, cards);
    }

    if (diceArr) {
        if (diceArr[0] === diceArr[1]) {
            socket.emit("next-turn", turnProp - 1, playersTemp, cards);
        }
        else {
            socket.emit("next-turn", turnProp, playersTemp, cards);
        }
    }
    else if (diceRoll[0] === diceRoll[1]) {
        socket.emit("next-turn", turnProp - 1, playersTemp, cards);
    }
    else {
        socket.emit("next-turn", turnProp, playersTemp, cards);
    }
}

export const pay = (players, currentPlayer, currentCard) => {
    const currentPlayerTemp = { ...currentPlayer };
    const payPlayer = { ...players[currentCard.payToPlayer] };
    const playersTemp = [...players];

    currentPlayerTemp.money -= currentCard.moneyTakeOut;
    playersTemp[currentPlayerTemp.number] = currentPlayerTemp;
    playersTemp[payPlayer.number] = payPlayer;

    if (currentCard.payToPlayer)
        payPlayer.money += currentCard.moneyTakeOut;

    return { playersTemp: playersTemp, currentPlayerTemp: currentPlayerTemp }
}


export const sellPlayerHouses = (cards, players, currentPlayer) => {
    const currentPlayerTemp = { ...currentPlayer };

    const cardsTemp = cards.map(card => {
        if (typeof card === "object" && card.owner === currentPlayer.number) {
            card.owner = null;
            currentPlayerTemp.money = parseInt(card.pokemon.cost * 0.5) * card.houses;
            card.houses = 0;
        }
        return card;
    })

    players[currentPlayer.number] = currentPlayerTemp;
    return { cardsTemp, playersTempAfterSell: players, currentPlayerTemp };
}


export const checkWin = (players, turn, currentPlayer) => {
    if (players.length === 1 && currentPlayer.number === turn) {
        return true;
    }
    return false;

}

export const playerLeave = (roomData,playerId, cards, players) => {
    const playerLeft = [...players].find(val => val.socketId === playerId);

    const newPlayers = players.map(val => {
        if(!roomData.includes(val.socketId)){
            val={};
        }
        return val;
    });

    const newCards = cards.map((val) => {
        if (typeof val === "object") {
            if (val.owner === playerLeft.number) {
                val.houses = 0;
                val.owner = null;
            }
        }
        return val
    })
    return { newPlayers, newCards };
}