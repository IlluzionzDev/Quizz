import styles from './join-quiz.module.scss';
import { send, useClient, useGameState, usePacketHandler } from 'api';
import { checkNameTaken, requestGameState, requestJoin } from 'api/packets/client';
import { GameState } from 'api/packets/packets';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from 'hooks';
import { SNameTakenResult, SPID } from 'api/packets/server';
import { CenterSection, FullSection } from '@design-system/layout/section';
import { Container } from '@design-system/layout/container';
import Navigation from '@components/layout/navigation';
import { Button, TextButton } from '@design-system/button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Flex } from '@design-system/layout/flex';
import { Heading } from '@design-system/typography';
import { TextField } from '@design-system/field';

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
    const [validName, setValidName] = useState(true);

    const [submittedCode, setSubmittedCode] = useState(false);

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
            setValidName(false);
        } else {
            // Use reference values in callback, can't pass state here
            send(requestJoin(codeRef.current, nameRef.current));
        }
    };

    usePacketHandler(SPID.SNameTakenResult, onNameTakenResult);

    return (
        <FullSection>
            <Navigation
                backlink={
                    <TextButton onClick={() => router.push('/')} startIcon={<FaArrowLeft />}>
                        Go Back
                    </TextButton>
                }
            />
            <CenterSection>
                {validGame ? (
                    <Flex direction="column" padding={7} gap={7} alignItems="center">
                        <Heading element="h1" variant="heading-1">
                            Join Quiz
                        </Heading>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                checkName();
                                setSubmittedCode(true);
                            }}
                        >
                            <TextField
                                error={submittedCode && !validName ? 'Name already taken' : ''}
                                value={name}
                                onChange={(e) => {
                                    setName(e.currentTarget.value);
                                    // Remove error after changing
                                    if (submittedCode) setSubmittedCode(false);
                                }}
                                label="Enter Name"
                                id="playerName"
                                name="player name"
                                placeholder="Name"
                                maxLength={16}
                            />
                        </form>
                        <TextButton
                            endIcon={<FaArrowRight />}
                            disabled={gameCode.length != 5}
                            onClick={() => {
                                checkName();
                                setSubmittedCode(true);
                            }}
                        >
                            Join Game
                        </TextButton>
                    </Flex>
                ) : (
                    <Flex direction="column" padding={7} gap={7} alignItems="center">
                        <Heading element="h1" variant="heading-1">
                            Join Quiz
                        </Heading>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();

                                checkGameExists();
                                setSubmittedCode(true);
                            }}
                        >
                            <TextField
                                error={submittedCode && !validGame ? 'Game does not exist' : ''}
                                value={gameCode}
                                onChange={(e) => {
                                    setGameCode(e.currentTarget.value);
                                    // Remove error after changing
                                    if (submittedCode) setSubmittedCode(false);
                                }}
                                label="Enter Quiz Code"
                                id="gameCode"
                                name="game code"
                                placeholder="XXXXX"
                                maxLength={5}
                            />
                        </form>

                        <TextButton
                            endIcon={<FaArrowRight />}
                            disabled={gameCode.length != 5}
                            onClick={() => {
                                checkGameExists();
                                setSubmittedCode(true);
                            }}
                        >
                            Next
                        </TextButton>
                    </Flex>
                )}
            </CenterSection>
        </FullSection>
    );
};

export default JoinQuiz;