import React, { useEffect, useState } from 'react'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { wait } from './boradFunctionality/boardFunctionality';
import { useDispatch, useSelector } from 'react-redux';
import { setFight, setFightPokemons } from '../../redux/slices/pokemonFightSlices';
import { addAction } from '../../redux/slices/socketActionsSlices';
import socket from '../../api/socket';
import myPokemonWon from "../../audio/my-pokemon-won.wav"
import myPokemonLost from "../../audio/my-pokemon-lost.wav"
import PokemonHeal from "../../audio/heal.mp3"
import hit from "../../audio/hit.mp3"
import superHit from "../../audio/super.mp3"

const BorderLinearProgress = styled(LinearProgress)(() => ({
    height: 18,
    borderRadius: 5,
    width: "75%",
    border: "4px solid gray",
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: "white",
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 8,
        backgroundColor: "green",
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 8,
        backgroundColor: "green",
    },
}));

export default function PokemonFight({ turn, currentPlayer, card, endTurn, setCards, cards }) {
    const { pokemons } = useSelector(state => state.pokemonFight);
    const { players } = useSelector(state => state.players);
    const { actions } = useSelector(state => state.socketActions);
    const { user } = useSelector(state => state.user);
    const [heal, setHeal] = useState({ healer: "" });
    const [superAttack, setSuperAttack] = useState({ attacker: "" });
    const [damage, setDamage] = useState({ damaged: "" });
    const [canAttack, setCanAttack] = useState(true);
    const [enemyAttackTurn, setEnemyAttack] = useState(false);
    const [die, setDie] = useState({ dead: "" });
    const dispatch = useDispatch();

    useEffect(() => {//add pokemon play turn to the socket actions
        if (!actions.includes("pokemon-play-turn")) {

            socket.on("pokemon-play-turn", (newPokemons, method, attackingName, attackingEnemy, damage = 0) => {//update pokemons as new pokemons 
                //send method to know what to show on screen attcking name and enemy to show who to dmg and how much
                if (turn !== currentPlayer.number) {
                    if (method === "hp") {
                        new Audio(PokemonHeal).play();
                        setHeal({ healer: attackingName });
                        setTimeout(() => setHeal({ healer: "" }), 1800);
                        dispatch(setFightPokemons(newPokemons));
                        return;
                    }
                    else if (method === "super") {
                        new Audio(superHit).play()
                        setSuperAttack({ attacker: attackingName });
                        setTimeout(() => {
                            setDamage({ damaged: "" });
                            setSuperAttack({ attacker: "" });
                        }, 1800);
                    }
                    else { new Audio(hit).play() }
                    setDamage({ damaged: attackingEnemy, damage: damage });
                    setTimeout(() => {
                        setDamage({ damaged: "" });
                    }, 3200);
                    dispatch(setFightPokemons(newPokemons));
                    checkGenralWin(attackingName, newPokemons);
                }

            })
            dispatch(addAction("pokemon-play-turn"));
        }// eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (enemyAttackTurn) {
            enemyAttack();
            setEnemyAttack(false);
        }// eslint-disable-next-line
    }, [enemyAttackTurn])

    const checkGenralWin = async (attackingName, newPokemons) => {//genral win check win without changing anything in cards 
        if (newPokemons.myPokemon.hp <= 0 || newPokemons.enemy.hp <= 0) {
            if (attackingName === "myPokemon") {
                setDie({ dead: "enemy" });
                new Audio(myPokemonWon).play()
            }
            else {
                setDie({ dead: "myPokemon" });
                new Audio(myPokemonLost).play()
            }
            await wait(2000);
            dispatch(setFightPokemons({ pokemon: "" }));
            dispatch(setFight(""));
        }
    }

    const attackFunc = (method, attacking, attackingName, attackingEnemy, enemy = false) => {
        //attack the other pokemon and update everything needed - enemy true means the enemy is attacking and dont run the function again just let the user attac
        //send method to know what to show on screen attcking name and enemy to show who to dmg and how much
        let damage = attackingName === "myPokemon" ? Math.floor(Math.random() * (attacking.attack - 5 + user.extraStr)) : Math.floor(Math.random() * (attacking.attack - 8));
        let def = attackingName === "enemy" ? Math.floor(Math.random() * (pokemons[attackingEnemy].def - 5 + user.extraStr)) : Math.floor(Math.random() * (pokemons[attackingEnemy].def - 8));
        let flag = false;

        if (method === "hp") {
            if (!attacking.heal.avilable)
                return
            const hpAdd = attackingName === "enemy" ? pokemons.ememyInitalHp - attacking.hp : pokemons.myInitialHp - attacking.hp;
            const healAmmount = Math.floor(Math.random() * parseInt(hpAdd * 0.5));

            const newPokemons = {
                ...pokemons,
                [`${attackingName}`]: {
                    ...attacking,
                    hp: healAmmount + attacking.hp,
                    heal: { avilable: false, roundsPassed: 0 },

                    superPower: {
                        avilable: attacking.superPower.roundsPassed >= 6 || attacking.superPower.avilable ? true : false,
                        roundsPassed: attacking.superPower.roundsPassed >= 6 ? 0 : attacking.superPower.roundsPassed + 1
                    },
                },
                [`${attackingEnemy}`]: {
                    ...pokemons[`${attackingEnemy}`],
                    superPower: {
                        avilable: pokemons[`${attackingEnemy}`].superPower.roundsPassed >= 6 || pokemons[`${attackingEnemy}`].superPower.avilable ? true : false,
                        roundsPassed: pokemons[`${attackingEnemy}`].superPower.roundsPassed >= 6 ? 0 : pokemons[`${attackingEnemy}`].superPower.roundsPassed + 1
                    },

                    heal: {
                        avilable: pokemons[`${attackingEnemy}`].heal.roundsPassed >= 4 || pokemons[`${attackingEnemy}`].heal.avilable ? true : false,
                        roundsPassed: pokemons[`${attackingEnemy}`].heal.roundsPassed >= 4 ? 0 : pokemons[`${attackingEnemy}`].heal.roundsPassed + 1
                    }

                }
            };

            dispatch(setFightPokemons(newPokemons));
            setCanAttack(false);
            setHeal({ healer: attackingName });

            if (!enemy) {
                setTimeout(() => {
                    setEnemyAttack(true);
                    setHeal({ healer: "" });
                }, 1800)

                setTimeout(() => {
                    setCanAttack(true);
                }, 3200)
            }
            else {
                setTimeout(() => {
                    setHeal({ healer: "" });
                }, 1800)
            }
            socket.emit("pokemon-play-turn", newPokemons, method, attackingName, attackingEnemy, 0);
            return;
        }

        else if (method === "super") {
            if (!attacking.superPower.avilable)
                return;
            new Audio(superHit).play()

            damage = Math.floor(Math.random() * (attacking.attack - 15) + 20);
            def -= 5;
            flag = true;
            setSuperAttack({ attacker: "" });

            setSuperAttack({ attacker: attackingName });
            setTimeout(() => {
                setDamage({ damaged: "" });
                setSuperAttack({ attacker: "" });
            }, 1800);

        }
        else { new Audio(hit).play() }
        damage = damage - def < 0 ? 0 : damage - def;
        setDamage({ damaged: attackingEnemy, damage: damage });
        setCanAttack(false);

        const newPokemons = {
            ...pokemons,
            [`${attackingName}`]: {
                ...attacking,

                superPower: flag ? { avilable: false, roundsPassed: 0 } :
                    {
                        avilable: attacking.superPower.roundsPassed === 6 || attacking.superPower.avilable ? true : false,
                        roundsPassed: attacking.superPower.roundsPassed === 6 ? 0 : attacking.superPower.roundsPassed + 1
                    },

                heal: {
                    avilable: attacking.heal.roundsPassed === 4 || attacking.heal.avilable ? true : false,
                    roundsPassed: attacking.heal.roundsPassed === 4 ? 0 : attacking.heal.roundsPassed + 1
                }
            },
            [`${attackingEnemy}`]: {
                ...pokemons[`${attackingEnemy}`],
                hp: pokemons[`${attackingEnemy}`].hp - damage,

                superPower: {
                    avilable: pokemons[`${attackingEnemy}`].superPower.roundsPassed === 6 || pokemons[`${attackingEnemy}`].superPower.avilable ? true : false,
                    roundsPassed: pokemons[`${attackingEnemy}`].superPower.roundsPassed === 6 ? 0 : pokemons[`${attackingEnemy}`].superPower.roundsPassed + 1
                },

                heal: {
                    avilable: pokemons[`${attackingEnemy}`].heal.roundsPassed === 4 || pokemons[`${attackingEnemy}`].heal.avilable ? true : false,
                    roundsPassed: pokemons[`${attackingEnemy}`].heal.roundsPassed === 4 ? 0 : pokemons[`${attackingEnemy}`].heal.roundsPassed + 1
                }
            }
        };
        dispatch(setFightPokemons(newPokemons));
        socket.emit("pokemon-play-turn", newPokemons, method, attackingName, attackingEnemy, damage);
        checkWin(attackingName, newPokemons, enemy);
    }
    const checkWin = async (attackingName, newPokemons, enemy = false) => {//check win and if the player won update the cards so that the player have the house
        //and end turn with new cards
        if (newPokemons.myPokemon.hp <= 0 || newPokemons.enemy.hp <= 0) {
            const currentPlayerTemp = { ...currentPlayer };
            const playersTemp = [...players];
            let newCards = [...cards];

            currentPlayerTemp.money -= pokemons.enemy.cost;
            playersTemp[turn] = currentPlayerTemp;
            if (attackingName === "myPokemon") {
                newCards = [...cards];
                newCards[card.pos].owner = currentPlayer.number;
                newCards[card.pos].houses = 1;
                setDie({ dead: "enemy" });
                new Audio(myPokemonWon).play()
            }
            else {
                new Audio(myPokemonLost).play()
                setDie({ dead: "myPokemon" });
            }

            setEnemyAttack(false);
            setCards(newCards);
            await wait(2000);
            endTurn(playersTemp, currentPlayerTemp, turn, false, true, newCards);
            dispatch(setFightPokemons({ pokemon: "" }));
            dispatch(setFight(""));
            return;
        }

        if (!enemy) {
            setTimeout(() => {
                setEnemyAttack(true);
            }, 1800)

            setTimeout(() => {
                setCanAttack(true);
                setDamage({ damaged: "" });

            }, 3200)
        }
        else {
            setTimeout(() => {
                setDamage({ damaged: "" });
            }, 3200)
        }

    }
    //players currentplayer turn false true cards

    const enemyAttack = () => {//after play attack the enemy should atttck
        if (pokemons.enemy.hp < pokemons.ememyInitalHp * 0.5 && pokemons.enemy.heal.avilable) {
            attackFunc("hp", pokemons.enemy, "enemy", "myPokemon", true);
        }
        else if (pokemons.enemy.superPower.avilable) {
            attackFunc("super", pokemons.enemy, "enemy", "myPokemon", true);
        }
        else {
            attackFunc("attack", pokemons.enemy, "enemy", "myPokemon", true);
        }
    }

    return (
        <>
            <div className="my-pokemon-fight">
                <h2 className="pokemon-hp">HP {pokemons.myPokemon.hp} / {pokemons.myInitialHp}</h2>
                <BorderLinearProgress style={{ colorPrimary: ((pokemons.myPokemon.hp / pokemons.myInitialHp) * 100) > 20 ? "red" : "green" }} variant="determinate" value={(pokemons.myPokemon.hp / pokemons.myInitialHp) * 100} />

                <div className="flex">

                    {heal.healer === "myPokemon" ? <img className="heal" src={require(`../../images/heal.gif`).default} alt="heal"></img> : null}


                    {damage.damaged === "myPokemon" ?
                        <div className="damage-div">
                            <h2 className="damage">{damage.damage}</h2>
                        </div> : null}
                    {superAttack.attacker === "enemy" ? <div className="super-attack-animation-on-me">
                        <img alt="pokemon-superattack" src={require(`../../images/fire-${pokemons.enemy.color}.gif`).default}></img>
                    </div>
                        : null}
                    <img className={die.dead === "myPokemon" ? "pokemon-dead" : damage.damaged === "enemy" ? "attack-animation" : null}
                        src={require(`../../sprites-animations/${pokemons.myPokemon.name}-back.gif`).default} alt={pokemons.myPokemon.name} ></img>

                    <div className="flex column">

                        {canAttack && currentPlayer.number === turn ?
                            <div style={{ position: "absolute" }}>
                                <Button onClick={() => attackFunc("attack", pokemons.myPokemon, "myPokemon", "enemy")} >Attack</Button>
                                <Button onClick={() => attackFunc("hp", pokemons.myPokemon, "myPokemon", "enemy")} style={{ color: pokemons.myPokemon.heal.avilable ? null : "gray", cursor: pokemons.myPokemon.heal.avilable ? null : "default" }}>Heal</Button>
                                <Button onClick={() => attackFunc("super", pokemons.myPokemon, "myPokemon", "enemy")} style={{ color: pokemons.myPokemon.superPower.avilable ? null : "gray", cursor: pokemons.myPokemon.superPower.avilable ? null : "default" }}>Ultimate</Button>
                            </div> : null}
                    </div>

                </div>
            </div>

            <div className="enemy-pokemon-fight">
                <h2 className="pokemon-hp">HP</h2>
                {heal.healer === "enemy" ? <img className="heal" src={require(`../../images/heal.gif`).default} alt="heal"></img> : null}

                {damage.damaged === "enemy" ?
                    <div className="damage-div">
                        {console.log(damage)}
                        <h2 className="damage">{damage.damage}</h2>
                    </div> : null}
                <BorderLinearProgress style={{ colorPrimary: ((pokemons.enemy.hp / pokemons.myInitialHp) * 100) > 20 ? "red" : "green" }} variant="determinate" value={(pokemons.enemy.hp / pokemons.ememyInitalHp) * 100} />
                {superAttack.attacker === "myPokemon" ? <div className="super-attack-animation-on-enemy" > <img alt="special attack" src={require(`../../images/fire-${pokemons.myPokemon.color}.gif`).default}></img></div>
                    : null}
                <img className={die.dead === "enemy" ? "pokemon-dead" : damage.damaged === "myPokemon" ? "attack-animation" : null}
                    src={require(`../../sprites-animations/${pokemons.enemy.name}-front.gif`).default} alt={pokemons.enemy.name} ></img>
            </div>
        </>
    )
}
