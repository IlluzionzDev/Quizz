import CenterSection from '@components/layout/CenterSection';
import FullSection from '@components/layout/FullSection';
import { send, useClient, usePacketHandler, useRequireGame, useSyncedTimer } from 'api';
import { answer } from 'api/packets/client';
import { SAnswerResult, SPID } from 'api/packets/server';
import { useAppDispatch, useAppSelector } from 'hooks';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Game: NextPage = () => {
    // Use game lient
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

    // Accpet answer result
    usePacketHandler(SPID.SAnswerResult, (dispatch: Function, data: SAnswerResult) => {
        setResult(data.result);
    });

    // If this is the host, display host controls
    if (gameData?.owner) {
        // TOOD: Display answers and score
        return <FullSection></FullSection>;
    } else if (question == null) {
        // No question, nothing to render
        return <FullSection></FullSection>;
    } else if (result !== null) {
        // Display results of chosen answer
        return <FullSection>{result ? <h1>Correct!</h1> : <h1>Incorrect!</h1>}</FullSection>;
    } else if (!answered) {
        // Provide questions to answer
        return (
            <FullSection>
                <h1>{question.question}</h1>
                {question.answers.map((answer, id) => {
                    return (
                        <button key={id} onClick={() => setAnswer(id)}>
                            {answer}
                        </button>
                    );
                })}
            </FullSection>
        );
    } else {
        // Answered the question, show waiting for results screen
        return <FullSection><h1>Waiting...</h1></FullSection>;
    }
};

export default Game;
