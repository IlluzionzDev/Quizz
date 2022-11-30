import styles from './game.module.scss';
import CenterSection from '@components/layout/CenterSection';
import FullSection from '@components/layout/FullSection';
import { send, useClient, usePacketHandler, useRequireGame, useSyncedTimer } from 'api';
import { answer } from 'api/packets/client';
import { SAnswerResult, SPID, SPlayerData } from 'api/packets/server';
import { useAppDispatch, useAppSelector } from 'hooks';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Container from '@components/layout/Container';

type GameNavProps = {
    selfData: SPlayerData | null;
};

const GameNav: React.FC<GameNavProps> = ({ selfData }) => (
    <header className={`container ${styles.header}`}>
        <nav>
            <ul>
                <li className={styles.name}>{selfData?.name}</li>
                <li className={styles.score}>{selfData?.score}</li>
            </ul>
        </nav>
    </header>
);

const Game: NextPage = () => {
    // Use game client
    useClient();

    // Ensure we are in a game
    useRequireGame();

    // Question timer
    const timer = useSyncedTimer(10);

    // Game state
    const dispatch = useAppDispatch();
    const gameState = useAppSelector((state) => state.client.gameState);
    const gameData = useAppSelector((state) => state.client.gameData);
    const players = useAppSelector((state) => state.client.players);
    const selfData = useAppSelector((state) => state.client.selfData);
    const question = useAppSelector((state) => state.client.question);

    // If has answered
    const [answered, setAnswered] = useState(false);
    // Result of answering, null if still waiting for marks
    const [result, setResult] = useState<boolean | null>(null);

    // When question changes, reset answer state
    useEffect(() => {
        setAnswered(false);
        setResult(null);
    }, [question]);

    /**
     * Select answer
     */
    function setAnswer(index: number) {
        setAnswered(true);
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
        // TOOD: Display answers and score
        return (
            <FullSection>
                <CenterSection>
                    <div className={styles.host}>
                        <p className={styles.host__question}>{question?.question}</p>
                        <h2>Time Remaining: {timer}</h2>

                        <div className={styles.host__players}>
                            {topPlayers().map((player, id) => {
                                return (
                                    <div key={id} className={styles.host__players__player}>
                                        {player.name}
                                        <div className={styles.host__players__player__score}>{player.score}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CenterSection>
            </FullSection>
        );
    } else if (question == null) {
        // No question, nothing to render
        return <FullSection></FullSection>;
    } else if (result !== null) {
        // Display results of chosen answer
        const answerColor = result ? '#56c246' : '#b32430';

        return (
            <FullSection>
                <div className={styles.result} style={{ background: answerColor }}>
                    <CenterSection>{result ? <h1>Correct!</h1> : <h1>Incorrect!</h1>}</CenterSection>
                </div>
            </FullSection>
        );
    } else if (!answered) {
        // Provide questions to answer
        return (
            <FullSection>
                <GameNav selfData={selfData} />
                <CenterSection>
                    <h1 className={styles.question__title}>{question.question}</h1>
                    <h2>Time Remaining: {timer}</h2>
                    <div className={styles.answers}>
                        {question.answers.map((answer, id) => {
                            return (
                                <button key={id} className={styles.answers__answer} onClick={() => setAnswer(id)}>
                                    {answer}
                                </button>
                            );
                        })}
                    </div>
                </CenterSection>
            </FullSection>
        );
    } else {
        // Answered the question, show waiting for results screen
        return (
            <FullSection>
                <GameNav selfData={selfData} />
                <CenterSection>
                    <h1>Waiting...</h1>
                </CenterSection>
            </FullSection>
        );
    }
};

export default Game;
