import CenterSection from '@components/layout/CenterSection';
import Container from '@components/layout/Container';
import FullSection from '@components/layout/FullSection';
import PlayerNav from '@components/layout/PlayerNav';
import { send, useClient, useGameState } from 'api';
import { requestJoin } from 'api/packets/client';
import { GameState } from 'api/packets/packets';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

const JoinQuiz: NextPage = () => {
    const client = useRef(useClient());
    const router = useRouter();

    const [gameCode, setGameCode] = useState('');

    function joinGame() {
        send(requestJoin(gameCode, 'Test Name'));
    }

    // When game joined, enters waiting state so redirect to waiting room
    useGameState(GameState.WAITING, () => {
        router.push('/waiting');
    });

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
                <input
                    type="text"
                    value={gameCode}
                    onChange={(e) => {
                        setGameCode(e.currentTarget.value);
                    }}
                />
            </Container>
            <button
                className="button button__solid"
                onClick={(e) => {
                    joinGame();
                }}
            >
                Join Game
            </button>
        </FullSection>
    );
};

export default JoinQuiz;
