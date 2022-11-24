import styles from './waiting.module.scss';
import FullSection from '@components/layout/FullSection';
import PlayerNav from '@components/layout/PlayerNav';
import { useClient, useRequireGame, disconnect, send } from 'api';
import { GameState } from 'api/packets/packets';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import Container from '@components/layout/Container';
import { CStateChangeState, stateChange } from 'api/packets/client';
import { useAppDispatch, useAppSelector } from 'hooks';

const Waiting: NextPage = () => {
    const router = useRouter();

    // Use game lient
    useClient();

    // Ensure we are in a game
    useRequireGame();

    const dispatch = useAppDispatch();

    const gameState = useAppSelector((state) => state.client.gameState);
    const gameData = useAppSelector((state) => state.client.gameData);
    const players = useAppSelector((state) => state.client.players);

    /**
     * Disconnect client from the game
     */
    function disconnectClient() {
        if (gameState === GameState.WAITING || gameState === GameState.NOT_FOUND) {
            disconnect(dispatch);
        }
    }

    /**
     * Attempt to start game, only works if host
     */
    function startGame() {
        send(stateChange(CStateChangeState.START));
    }

    return (
        <FullSection>
            <PlayerNav
                onBack={() => {
                    disconnectClient();
                    router.push('/');
                }}
                backlink="Disconnect"
                title="Waiting Room"
            />
            <Container>
                <div className={styles.waiting}>
                    <div className={styles.waiting__info}>
                        <h1 className={styles.waiting__info__id}>{gameData?.id}</h1>
                        <h2 className={styles.waiting__info__title}>{gameData?.title}</h2>
                        {gameData?.owner ? (
                            <button className="button button__solid" onClick={startGame}>
                                Start Game
                            </button>
                        ) : (
                            <p>Waiting for start...</p>
                        )}
                    </div>
                    <div className={styles.waiting__players}>
                        {Object.entries(players).map((player, id) => {
                            return <div key={id}>{player[1].name}</div>;
                        })}
                    </div>
                </div>
            </Container>
        </FullSection>
    );
};

export default Waiting;
