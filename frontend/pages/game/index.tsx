import styles from './game.module.scss';
import { send, useClient, useGameState, usePacketHandler, useRequireGame, useSyncedTimer } from 'api';
import { answer } from 'api/packets/client';
import { SAnswerResult, SPID, SPlayerData } from 'api/packets/server';
import { useAppDispatch, useAppSelector } from 'hooks';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GameState } from 'api/packets/packets';
import { CenterSection, FullSection } from '@design-system/layout/section';
import { Flex } from '@design-system/layout/flex';
import { Container } from '@design-system/layout/container';
import { Heading, Label } from '@design-system/typography';
import { Badge } from '@design-system/badge';
import { Box } from '@design-system/layout/box';
import Navigation from '@components/layout/navigation';
import { TextButton } from '@design-system/button';
import { TightContainer } from '@design-system/layout/container/container';
import { FaCheck, FaTimes } from 'react-icons/fa';

type GameNavProps = {
    selfData: SPlayerData | null;
};

const GameNav: React.FC<GameNavProps> = ({ selfData }) => (
    <Box className={styles.gameNav}>
        <Container>
            <Flex direction="row" justifyContent="space-between" alignItems="center" paddingTop={6} paddingBottom={6}>
                <Label variant="md">{selfData?.name}</Label>
                <Badge variant="active">{selfData?.score}</Badge>
            </Flex>
        </Container>
    </Box>
);

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
                return a.score - b.score;
            })
            .slice(0, 5);
    }

    // Accpet answer result
    usePacketHandler(SPID.SAnswerResult, (dispatch: Function, data: SAnswerResult) => {
        // Set in answered state even if didn't answer to display results screen
        setAnswered(true);
        setResult(data.result);
    });

    // If this is the host, display host controls
    if (gameData?.owner) {
        return (
            <FullSection>
                <Container>
                    <Flex direction="column" paddingTop={11} gap={2} alignItems="center">
                        <Flex></Flex>
                        <Flex>
                            {topPlayers().map((player, id) => {
                                return (
                                    <div key={id} className={styles.host__players__player}>
                                        {player.name}
                                        <div className={styles.host__players__player__score}>{player.score}</div>
                                    </div>
                                );
                            })}
                        </Flex>
                    </Flex>
                </Container>
            </FullSection>
        );
    } else if (question == null) {
        // No question, nothing to render
        return <FullSection></FullSection>;
    } else if (result !== null) {
        // Display results of chosen answer
        return (
            <FullSection>
                <CenterSection>
                    <TightContainer>
                        <Flex direction="column" alignItems="center" paddingTop={11} gap={2}>
                            <Flex direction="column" gap={1}>
                                <Heading element="h1" variant="heading-1" color="primary600">
                                    {question.question}
                                </Heading>
                                <Label variant="xl">{timer}s</Label>
                            </Flex>
                            <Flex direction="column" gap={4} paddingTop={11} paddingBottom={11} alignItems="center" className={styles.answerBox}>
                                {question.answers.map((answer, id) => {
                                    return (
                                        <Flex
                                            key={id}
                                            alignItems="center"
                                            justifyContent="space-between"
                                            hasRadius
                                            paddingLeft={6}
                                            paddingRight={6}
                                            paddingTop={3}
                                            paddingBottom={3}
                                            className={styles.answer}
                                            aria-correct={id === answeredIndex && result}
                                            aria-incorrect={id === answeredIndex && !result}
                                        >
                                            <Label variant="lg">{answer}</Label>
                                            {id === answeredIndex && (result ? <FaCheck className={styles.correctIcon} /> : <FaTimes className={styles.incorrectIcon} />)}
                                        </Flex>
                                    );
                                })}
                            </Flex>
                        </Flex>
                    </TightContainer>
                </CenterSection>
                <GameNav selfData={selfData} />
            </FullSection>
        );
    } else if (!answered) {
        // Provide questions to answer
        return (
            <FullSection>
                <CenterSection>
                    <TightContainer>
                        <Flex direction="column" alignItems="center" paddingTop={11} gap={2}>
                            <Flex direction="column" gap={1}>
                                <Heading element="h1" variant="heading-1" color="primary600">
                                    {question.question}
                                </Heading>
                                <Label variant="xl">{timer}s</Label>
                            </Flex>
                            <Flex direction="column" gap={4} paddingTop={11} paddingBottom={11} alignItems="center" className={styles.answerBox}>
                                {question.answers.map((answer, id) => {
                                    return (
                                        <Flex key={id} alignItems="center" hasRadius paddingLeft={6} paddingRight={6} paddingTop={3} paddingBottom={3} className={styles.answer} onClick={() => setAnswer(id)}>
                                            <Label variant="lg">{answer}</Label>
                                        </Flex>
                                    );
                                })}
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
                        <Flex direction="column" alignItems="center" paddingTop={11} gap={2}>
                            <Flex direction="column" gap={1}>
                                <Heading element="h1" variant="heading-1" color="primary600">
                                    {question.question}
                                </Heading>
                                <Label variant="xl">{timer}s</Label>
                            </Flex>
                            <Flex direction="column" gap={4} paddingTop={11} paddingBottom={11} alignItems="center" className={styles.answerBox}>
                                {question.answers.map((answer, id) => {
                                    return (
                                        <Flex key={id} alignItems="center" hasRadius paddingLeft={6} paddingRight={6} paddingTop={3} paddingBottom={3} className={styles.answer} aria-selected={id === answeredIndex}>
                                            <Label variant="lg">{answer}</Label>
                                        </Flex>
                                    );
                                })}
                            </Flex>
                        </Flex>
                    </TightContainer>
                </CenterSection>
                <GameNav selfData={selfData} />
            </FullSection>
        );
    }
};

export default Game;
