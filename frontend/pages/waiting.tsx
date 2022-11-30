import styles from './waiting.module.scss';
import FullSection from '@components/layout/FullSection';
import PlayerNav from '@components/layout/PlayerNav';
import { useClient, useRequireGame, disconnect, send, useSyncedTimer, useGameState } from 'api';
import { GameState } from 'api/packets/packets';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import Container from '@components/layout/Container';
import { CStateChangeState, kickPlayer, stateChange } from 'api/packets/client';
import { useAppDispatch, useAppSelector } from 'hooks';
import { FaTimes } from 'react-icons/fa';

const Waiting: NextPage = () => {
    const router = useRouter();

    // Use game lient
    useClient();

    // Ensure we are in a game
    useRequireGame();

    const timer = useSyncedTimer(5);

    const dispatch = useAppDispatch();

    const gameState = useAppSelector((state) => state.client.gameState);
    const gameData = useAppSelector((state) => state.client.gameData);
    const players = useAppSelector((state) => state.client.players);

    // When game has started, redirect to game page
    useGameState(GameState.ACTIVE, () => {
        router.push('/game');
    });

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

    /**
     * Kick a player from the game
     */
    function kick(playerId: string) {
        send(kickPlayer(playerId));
    }

    let gameStateComponent = null;

    if (gameState === GameState.STARTING) {
        gameStateComponent = <p>Starting in {timer}s</p>;
    } else if (gameData?.owner) {
        gameStateComponent = (
            <button className="button button__solid" onClick={startGame}>
                Start Game
            </button>
        );
    } else {
        gameStateComponent = <p>Waiting for start...</p>;
    }

    return (
        <FullSection>
            <PlayerNav
                onBack={() => {
                    disconnectClient();
                    router.push('/');
                }}
                backlink={gameData?.owner ? 'End Game' : 'Disconnect'}
                title="Waiting Room"
            />
            <Container>
                <div className={styles.waiting}>
                    <div className={styles.waiting__info}>
                        <h1 className={styles.waiting__info__id}>{gameData?.id}</h1>
                        <h2 className={styles.waiting__info__title}>{gameData?.title}</h2>
                        {gameStateComponent}
                    </div>
                    <div className={styles.waiting__players}>
                        {Object.entries(players).map((player, id) => {
                            return (
                                <div key={id} className={styles.waiting__player}>
                                    <p>{player[1].name}</p>

                                    {gameData?.owner && (
                                        <div className={styles.waiting__player__kick}>
                                            <FaTimes
                                                onClick={() => {
                                                    kick(player[0]);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </FullSection>
    );
};

export default Waiting;
