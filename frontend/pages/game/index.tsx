import styles from './game.module.scss';
import { disconnect, send, useClient, useGameState, usePacketHandler, useRequireGame, useSyncedTimer } from 'api';
import { answer, CStateChangeState, stateChange } from 'api/packets/client';
import { SAnswerResult, SPID, SPlayerData, SQuestion } from 'api/packets/server';
import { useAppDispatch, useAppSelector } from 'hooks';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GameState, QuestionData } from 'api/packets/packets';
import Navigation from '@components/layout/navigation';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { AnimatePresence, Variants } from 'framer-motion';
import { setGameState } from 'store/clientSlice';
import classNames from 'classnames';
import { Badge, Box, Button, CenterSection, Container, Flex, FullSection, Label, TextButton, TightContainer } from '@illuzionz-studios/design-system';
import { MotionFlex, MotionHeading, MotionLabel } from '@components/motion';

type GameNavProps = {
    selfData: SPlayerData | null;
};

const GameNav: React.FC<GameNavProps> = ({ selfData }) => (
    <Box className={styles.gameNav}>
        <Container>
            <Flex direction="row" justifyContent="space-between" alignItems="center" paddingTop={6} paddingBottom={6}>
                <Label variant="md">{selfData?.name}</Label>
                <Badge variant="primary">{selfData?.score}</Badge>
            </Flex>
        </Container>
    </Box>
);

type AnswerSelectionProps = {
    question: SQuestion;
    answeredIndex: number;
    result: boolean | null;
    onAnswer: (id: number) => void;
};

const AnswerSelection: React.FC<AnswerSelectionProps> = ({ question, answeredIndex, result, onAnswer }) => {
    // New answer loading
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
        },
        exit: {
            opacity: 0,
            x: 50,
            transition: {
                staggerChildren: 0.05,
                type: 'spring',
                stiffness: 260,
                damping: 20
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <MotionFlex key={question.question + 'answers'} direction="column" gap={4} paddingTop={11} paddingBottom={11} alignItems="center" className={styles.answerBox} variants={loadInSideways} initial="hidden" animate="show" exit="exit">
                {question.answers.map((answer, id) => {
                    return (
                        <Flex
                            key={id}
                            alignItems="center"
                            justifyContent="space-between"
                            radius="md"
                            paddingLeft={6}
                            paddingRight={6}
                            paddingTop={3}
                            paddingBottom={3}
                            className={classNames(
                                styles.answer,
                                answeredIndex === -1 ? '' : id === answeredIndex && result != null ? (result ? styles.answer__correct : styles.answer__incorrect) : '',
                                answeredIndex !== -1 && id !== answeredIndex ? styles.answer__selected : ''
                            )}
                            aria-selected={result === null && id === answeredIndex}
                            onClick={() => {
                                if (answeredIndex === -1) onAnswer(id);
                            }}
                        >
                            <Label variant="lg">{answer}</Label>
                            {id === answeredIndex && result != null && (result ? <FaCheck className={styles.correctIcon} /> : <FaTimes className={styles.incorrectIcon} />)}
                        </Flex>
                    );
                })}
            </MotionFlex>
        </AnimatePresence>
    );
};

const Game: NextPage = () => {
    // Use game client
    useClient();

    // Ensure we are in a game
    useRequireGame();

    // Question timer
    const timer = useSyncedTimer(10);

    const router = useRouter();

    // Game state
    const dispatch = useAppDispatch();
    const gameState = useAppSelector((state) => state.client.gameState);
    const gameData = useAppSelector((state) => state.client.gameData);
    const players = useAppSelector((state) => state.client.players);
    const selfData = useAppSelector((state) => state.client.selfData);
    const question = useAppSelector((state) => state.client.question);

    // If has answered
    const [answered, setAnswered] = useState(false);
    const [answeredIndex, setAnsweredIndex] = useState(-1);
    // Result of answering, null if still waiting for marks
    const [result, setResult] = useState<boolean | null>(null);

    // When question changes, reset answer state
    useEffect(() => {
        setAnswered(false);
        setAnsweredIndex(-1);
        setResult(null);
    }, [question]);

    // When game set to finished, redirect to game-over
    useGameState(GameState.FINISHED, () => {
        // Route to game over page
        router.push('/game-over');
    });

    function skipQuestion() {
        send(stateChange(CStateChangeState.SKIP));
    }

    /**
     * Select answer
     */
    function setAnswer(index: number) {
        setAnswered(true);
        setAnsweredIndex(index);
        send(answer(index));
    }

    /**
     * Get top 5 players currently in the game
     */
    function topPlayers(): SPlayerData[] {
        // Get all player data
        const playerData: SPlayerData[] = [];
        Object.entries(players).forEach(([id, pData]) => {
            playerData.push(pData);
        });

        return playerData
            .sort((a, b) => {
                return b.score - a.score;
            })
            .slice(0, 5);
    }

    // Accpet answer result
    usePacketHandler(SPID.SAnswerResult, (dispatch: Function, data: SAnswerResult) => {
        // Set in answered state even if didn't answer to display results screen
        setAnswered(true);
        setResult(data.result);
    });

    const loadInTop: Variants = {
        hidden: {
            opacity: 0,
            y: -50
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
        },
        exit: {
            opacity: 0,
            x: 50,
            transition: {
                staggerChildren: 0.05,
                type: 'spring',
                stiffness: 260,
                damping: 20
            }
        }
    };

    // If this is the host, display host controls
    if (gameData?.owner) {
        return (
            <FullSection>
                <Navigation
                    backlink={
                        <TextButton
                            onClick={() => {
                                disconnect(dispatch);
                                dispatch(setGameState(GameState.UNSET));
                                router.push('/');
                            }}
                        >
                            End Game
                        </TextButton>
                    }
                />
                <TightContainer>
                    <MotionFlex direction="column" paddingTop={11} gap={2} alignItems="center" variants={loadInTop} initial="hidden" animate="show">
                        <Flex direction="column" gap={7} alignItems="center">
                            <MotionHeading element="h1" variant="heading-1" variants={loadInTop}>
                                {gameData.title}
                            </MotionHeading>
                            <Flex direction="column" gap={1} alignItems="center">
                                <MotionHeading element="h2" variant="heading-2" regular variants={loadInTop}>
                                    Current Question
                                </MotionHeading>
                                <MotionLabel variant="xl" color="primary600" variants={loadInTop}>
                                    {question?.question}
                                </MotionLabel>
                                <MotionLabel variant="xl" variants={loadInTop}>
                                    {timer}s
                                </MotionLabel>
                                <MotionFlex paddingTop={4} variants={loadInTop}>
                                    <Button variant="secondary" onClick={() => skipQuestion()}>
                                        Skip Question
                                    </Button>
                                </MotionFlex>
                            </Flex>
                        </Flex>
                        <Flex direction="column" gap={4} paddingTop={11} paddingBottom={11} alignItems="center" className={styles.playerBox}>
                            {topPlayers().map((player, id) => {
                                return (
                                    <MotionFlex
                                        key={id}
                                        direction="row"
                                        background="neutral100"
                                        className={styles.player}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        radius="md"
                                        paddingLeft={6}
                                        paddingRight={6}
                                        paddingTop={3}
                                        paddingBottom={3}
                                        variants={loadInTop}
                                    >
                                        <Label variant="lg">{player.name}</Label>
                                        <Badge variant="primary">{player.score}</Badge>
                                    </MotionFlex>
                                );
                            })}
                        </Flex>
                    </MotionFlex>
                </TightContainer>
            </FullSection>
        );
    } else if (question == null) {
        // No question, nothing to render
        return (
            <FullSection>
                <CenterSection>
                    <TightContainer>
                        <Flex direction="column" alignItems="center" paddingTop={11} gap={2}>
                            <Flex direction="column" gap={1}>
                                <MotionHeading element="h1" variant="heading-1" color="primary600">
                                    Loading Question...
                                </MotionHeading>
                                <Label variant="xl">0s</Label>
                            </Flex>
                            <Flex direction="column" gap={4} paddingTop={11} paddingBottom={11} alignItems="center" className={styles.answerBox}>
                                <Label variant="lg" color="neutral200">
                                    Loading Answers...
                                </Label>
                            </Flex>
                        </Flex>
                    </TightContainer>
                </CenterSection>
                <GameNav selfData={selfData} />
            </FullSection>
        );
    } else {
        // Answered the question, show waiting for results screen
        return (
            <FullSection>
                <CenterSection>
                    <TightContainer>
                        <AnimatePresence mode="wait">
                            <Flex direction="column" alignItems="center" paddingTop={11} gap={2}>
                                <MotionFlex id={question.question + 'info'} direction="column" gap={1} variants={loadInSideways} initial="hidden" animate="show">
                                    <MotionHeading element="h1" variant="heading-1" color="primary600">
                                        {question.question}
                                    </MotionHeading>
                                    <Label variant="xl">{timer}s</Label>
                                </MotionFlex>
                                <AnswerSelection
                                    question={question}
                                    answeredIndex={answeredIndex}
                                    result={result}
                                    onAnswer={(id) => {
                                        setAnswer(id);
                                    }}
                                />
                            </Flex>
                        </AnimatePresence>
                    </TightContainer>
                </CenterSection>
                <GameNav selfData={selfData} />
            </FullSection>
        );
    }
};

export default Game;
