import styles from './join-quiz.module.scss';
import { send, useClient, useGameState, usePacketHandler } from 'api';
import { checkNameTaken, requestGameState, requestJoin } from 'api/packets/client';
import { GameState } from 'api/packets/packets';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks';
import { SNameTakenResult, SPID } from 'api/packets/server';
import Navigation from '@components/layout/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { setGameState } from 'store/clientSlice';
import { CenterSection, Flex, FullSection, TextButton, TextField } from '@illuzionz-studios/design-system';
import { MotionFlex, MotionHeading, MotionTextButton, MotionTextField } from '@components/motion';

const JoinQuiz: NextPage = () => {
    // Start packet listener
    useClient();
    const router = useRouter();

    const dispatch = useAppDispatch();

    // Entered game code
    const [gameCode, setGameCode] = useState('');
    // Entered player name
    const [name, setName] = useState('');
    // If the code entered matches a valid game
    const [validGame, setValidGame] = useState(false);
    const [validName, setValidName] = useState(true);

    const [submittedCode, setSubmittedCode] = useState(false);
    // If has gotten response from server after submission
    const [gottenResponse, setGottenResponse] = useState(false);

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
            setGottenResponse(true);
        } else if (gameState === GameState.ACTIVE || gameState === GameState.FINISHED) {
            // Game already started or finished
            // TODO: Display warning
            console.log('Game has already started!');
            setGottenResponse(true);
        } else if (gameState === GameState.NOT_FOUND) {
            setGottenResponse(true);
        }
    }, [gameState]);

    /**
     * Sends a packet to request game state to see if this game does exists
     */
    const checkGameExists = () => {
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
            setValidName(false);
            setGottenResponse(true);
        } else {
            // Use reference values in callback, can't pass state here
            send(requestJoin(codeRef.current, nameRef.current));
        }
    };

    usePacketHandler(SPID.SNameTakenResult, onNameTakenResult);

    // Animations
    const loadInAnimation: Variants = {
        hidden: {
            opacity: 0,
            y: -50,
            x: 0
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.05,
                type: 'spring',
                stiffness: 260,
                damping: 20
            }
        },
        exit: {
            x: 50,
            opacity: 0,
            transition: {
                type: 'spring',
                stiffness: 260,
                damping: 20
            }
        }
    };

    const loadInSideways: Variants = {
        hidden: {
            opacity: 0,
            x: -50
        },
        show: {
            opacity: 1,
            x: 0,
            transition: {
                staggerChildren: 0.05,
                type: 'spring',
                stiffness: 260,
                damping: 20
            }
        }
    };

    return (
        <FullSection>
            <Navigation
                backlink={
                    <TextButton
                        onClick={() => {
                            // Reset joining
                            dispatch(setGameState(GameState.UNSET));

                            router.push('/');
                        }}
                        startIcon={<FaArrowLeft />}
                    >
                        Go Back
                    </TextButton>
                }
            />
            <CenterSection>
                <AnimatePresence mode="wait">
                    {validGame ? (
                        <MotionFlex key="enterName" direction="column" padding={7} gap={7} alignItems="center" variants={loadInSideways} initial="hidden" animate="show">
                            <MotionHeading element="h1" variant="heading-1" variants={loadInSideways}>
                                Join Quiz
                            </MotionHeading>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    checkName();
                                    setSubmittedCode(true);
                                }}
                            >
                                <MotionTextField
                                    variants={loadInSideways}
                                    error={submittedCode && gottenResponse && !validName ? 'Name already taken' : ''}
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.currentTarget.value);
                                        // Remove error after changing
                                        if (submittedCode) setSubmittedCode(false);
                                        setGottenResponse(false);
                                    }}
                                    label="Enter Name"
                                    id="playerName"
                                    name="player name"
                                    placeholder="Name"
                                    maxLength={16}
                                />
                            </form>
                            <MotionTextButton
                                variants={loadInSideways}
                                endIcon={<FaArrowRight />}
                                disabled={gameCode.length != 5}
                                onClick={() => {
                                    checkName();
                                    setSubmittedCode(true);
                                }}
                            >
                                Join Game
                            </MotionTextButton>
                        </MotionFlex>
                    ) : (
                        <MotionFlex key="enterQuizCode" direction="column" padding={7} gap={7} alignItems="center" variants={loadInAnimation} initial="hidden" animate="show" exit="exit">
                            <MotionHeading element="h1" variant="heading-1" variants={loadInAnimation}>
                                Join Quiz
                            </MotionHeading>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    checkGameExists();
                                    setSubmittedCode(true);
                                }}
                            >
                                <MotionTextField
                                    variants={loadInAnimation}
                                    error={submittedCode && gottenResponse && !validGame ? 'Game does not exist' : ''}
                                    value={gameCode}
                                    onChange={(e) => {
                                        setGameCode(e.currentTarget.value);
                                        // Remove error after changing
                                        if (submittedCode) setSubmittedCode(false);
                                        setGottenResponse(false);
                                    }}
                                    label="Enter Quiz Code"
                                    id="gameCode"
                                    name="game code"
                                    placeholder="XXXXX"
                                    maxLength={5}
                                />
                            </form>

                            <MotionTextButton
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                // transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.15 }}
                                endIcon={<FaArrowRight />}
                                disabled={gameCode.length != 5}
                                onClick={() => {
                                    checkGameExists();
                                    setSubmittedCode(true);
                                }}
                            >
                                Next
                            </MotionTextButton>
                        </MotionFlex>
                    )}
                </AnimatePresence>
            </CenterSection>
        </FullSection>
    );
};

export default JoinQuiz;
