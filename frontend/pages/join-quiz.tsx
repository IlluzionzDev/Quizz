import styles from './join-quiz.module.scss';
import Container from '@components/layout/Container';
import FullSection from '@components/layout/FullSection';
import PlayerNav from '@components/layout/PlayerNav';
import { send, useClient, useGameState, usePacketHandler } from 'api';
import { checkNameTaken, requestGameState, requestJoin } from 'api/packets/client';
import { GameState } from 'api/packets/packets';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import CenterSection from '@components/layout/CenterSection';
import { useAppSelector } from 'hooks';
import { SNameTakenResult, SPID } from 'api/packets/server';

const JoinQuiz: NextPage = () => {
    // Start packet listener
    useClient();
    const router = useRouter();

    // Entered game code
    const [gameCode, setGameCode] = useState('');
    // Entered player name
    const [name, setName] = useState('');
    // If the code entered matches a valid game
    const [validGame, setValidGame] = useState(false);

    // Reference of state for callback
    const nameRef = useRef('');
    const codeRef = useRef('');

    // Client state data
    const gameState = useAppSelector((state) => state.client.gameState);
    const gameData = useAppSelector((state) => state.client.gameData);

    useEffect(() => {
        if (gameData !== null) {
            router.push('/waiting');
        }
    }, [gameData, router]);

    // Listen for game state response to see if game exists
    useEffect(() => {
        if (gameState === GameState.WAITING) {
            // Game is currently waiting to start
            setValidGame(true);
        } else if (gameState === GameState.NOT_FOUND) {
            // TODO: Display dialog that doesn't exist
            console.log('Game does not exist!');
        } else if (gameState === GameState.ACTIVE || gameState === GameState.FINISHED) {
            // Game already started or finished
            // TODO: Display warning
            console.log('Game has already started!');
        }
    }, [gameState]);

    /**
     * Sends a packet to request game state to see if this game does exists
     */
    const checkGameExists = () => {
        setValidGame(false);
        send(requestGameState(gameCode));
    };

    /**
     * Check if we can use this name
     */
    const checkName = () => {
        // Store data in temp ref so we can pass to callback
        nameRef.current = name;
        codeRef.current = gameCode;
        send(checkNameTaken(gameCode, name));
    };

    /**
     * Listen for name result, if valid we will join the game
     */
    const onNameTakenResult = (dispatch: Function, data: SNameTakenResult) => {
        if (data.result) {
            // Name taken, TODO: Dialog
            console.log('Name Taken!');
        } else {
            // Use reference values in callback, can't pass state here
            send(requestJoin(codeRef.current, nameRef.current));
        }
    };

    usePacketHandler(SPID.SNameTakenResult, onNameTakenResult);

    return (
        <FullSection>
            <PlayerNav
                onBack={() => {
                    router.push('/');
                }}
                backlink="Go Back"
                title="Join Game"
            />
            <Container>
                <CenterSection>
                    {validGame ? (
                        <div>
                            <h1>Enter Name</h1>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.currentTarget.value);
                                }}
                                className={styles.code__input}
                                maxLength={10}
                            />

                            <button
                                className="button button__solid"
                                onClick={(e) => {
                                    checkName();
                                }}
                                type="submit"
                            >
                                Join Game
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h1>Enter Game Code</h1>
                            <input
                                type="text"
                                placeholder="XXXXX"
                                value={gameCode}
                                onChange={(e) => {
                                    setGameCode(e.currentTarget.value);
                                }}
                                className={styles.code__input}
                                maxLength={5}
                                minLength={5}
                            />

                            <button
                                className="button button__solid"
                                onClick={(e) => {
                                    checkGameExists();
                                }}
                                disabled={gameCode.length != 5}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </CenterSection>
            </Container>
        </FullSection>
    );
};

export default JoinQuiz;
