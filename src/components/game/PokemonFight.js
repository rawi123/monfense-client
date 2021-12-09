import React, { useEffect, useState } from 'react'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { wait } from './boradFunctionality/boardFunctionality';
import { useSelector } from 'react-redux';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
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

export default function PokemonFight({ turn, currentPlayer, card, pokemons, setPokemons, endTurn, setCards, cards }) {
    const { players } = useSelector(state => state.players);
    const [heal, setHeal] = useState({ healer: "" });
    const [superAttack, setSuperAttack] = useState({ attacker: "" });
    const [damage, setDamage] = useState({ damaged: "" });
    const [canAttack, setCanAttack] = useState(true);
    const [enemyAttackTurn, setEnemyAttack] = useState(false);

    useEffect(() => {
        if (enemyAttackTurn) {
            enemyAttack();
            setEnemyAttack(false);
        }
    }, [enemyAttackTurn])

    const attackFunc = (method, attacking, attackingName, attackingEnemy, enemy = false) => {

        let damage = attackingName === "myPokemon" ? Math.floor(Math.random() * (attacking.attack - 5)) : Math.floor(Math.random() * (attacking.attack - 15));
        let def = attackingName === "myPokemon" ? Math.floor(Math.random() * (pokemons[attackingEnemy].def - 5)) : Math.floor(Math.random() * (pokemons[attackingEnemy].def - 15));
        let flag = false;

        if (method === "hp") {
            if (!attacking.heal.avilable)
                return
            const hpAdd = attackingName === "enemy" ? pokemons.ememyInitalHp - attacking.hp : pokemons.myInitialHp - attacking.hp;
            const healAmmount = Math.floor(Math.random() * parseInt(hpAdd * 0.5));


            setPokemons({
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
            });

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
            return;
        }

        else if (method === "super") {
            if (!attacking.superPower.avilable)
                return;
            damage = Math.floor(Math.random() * (attacking.attack - 15) + 20);
            def-=5;
            flag = true;
            setSuperAttack({ attacker: attackingName });
            setTimeout(() => {
                setDamage({ damaged: "" });
                setSuperAttack({ attacker: "" });
            }, 1800);

        }

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
        setPokemons(newPokemons);
        checkWin(attackingName, newPokemons,enemy);
    }

    const checkWin = async (attackingName, newPokemons,enemy) => {
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
            }
            setEnemyAttack(false);
            setCards(newCards);
            await wait(2000);
           
            setPokemons({ pokemon: "" });
            endTurn(playersTemp, currentPlayerTemp, turn, false, true, newCards);
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

    const enemyAttack = () => {
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
                    {console.log(superAttack.attacker, damage?.damaged)}
                    {console.log("super power", pokemons.myPokemon.superPower.avilable)}
                    <img className={superAttack.attacker === "myPokemon" ? "super-attack-animation" : damage.damaged === "enemy" ? "attack-animation" : null}
                        src={require(`../../sprites-animations/${pokemons.myPokemon.name}-back.gif`).default} alt={pokemons.myPokemon.name} ></img>

                    <div className="flex column">

                        {canAttack ?
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
                        <h2 className="damage">{damage.damage}</h2>
                    </div> : null}
                <BorderLinearProgress style={{ colorPrimary: ((pokemons.enemy.hp / pokemons.myInitialHp) * 100) > 20 ? "red" : "green" }} variant="determinate" value={(pokemons.enemy.hp / pokemons.ememyInitalHp) * 100} />
                <img className={superAttack.attacker === "enemy" ? "super-attack-animation" : damage.damaged === "myPokemon" ? "attack-animation" : null}
                    src={require(`../../sprites-animations/${pokemons.enemy.name}-front.gif`).default} alt={pokemons.enemy.name} ></img>
            </div>
        </>
    )
}
