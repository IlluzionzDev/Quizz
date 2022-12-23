import styles from './waiting.module.scss';
import { useClient, useRequireGame, disconnect, send, useSyncedTimer, useGameState } from 'api';
import { GameState } from 'api/packets/packets';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { CStateChangeState, kickPlayer, stateChange } from 'api/packets/client';
import { useAppDispatch, useAppSelector } from 'hooks';
import { FaPlay, FaTimes } from 'react-icons/fa';
import { CenterSection, FullSection } from '@design-system/layout/section';
import Navigation from '@components/layout/navigation';
import { Button, TextButton } from '@design-system/button';
import { Container } from '@design-system/layout/container';
import { Flex } from '@design-system/layout/flex';
import { Heading, Label } from '@design-system/typography';

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
    const selfData = useAppSelector((state) => state.client.selfData);
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
        gameStateComponent = <Label variant="lg">Starting in {timer}s</Label>;
    } else if (gameData?.owner) {
        gameStateComponent =
            Object.entries(players).length >= 1 ? (
                <Button variant="primary" startIcon={<FaPlay />} onClick={startGame} disabled={Object.entries(players).length <= 0}>
                    Start Game
                </Button>
            ) : null;
    } else {
        gameStateComponent = <Label variant="lg">{selfData?.name}</Label>;
    }

    return (
        <FullSection>
            <Navigation
                backlink={
                    <TextButton onClick={() => disconnectClient()}>
                        {gameData?.owner ? 'End Game' : 'Disconnect'}
                    </TextButton>
                }
            />
            <Container>
                <Flex direction="column" paddingTop={11} gap={2} alignItems="center">
                    <Flex direction="column" gap={7} alignItems="center">
                        <Flex direction="column" gap={1} alignItems="center">
                            <Heading element="h1" variant="display" color="primary600">
                                {gameData?.id}
                            </Heading>
                            <Heading element="h2" variant="heading-2">
                                {gameData?.title}
                            </Heading>
                        </Flex>

                        {gameStateComponent}
                    </Flex>

                    <Flex direction="row" padding={11} className={styles.players} gap={3}>
                        {Object.entries(players).length != 0 ? (
                            Object.entries(players).map((player, id) => {
                                return (
                                    <Flex key={id} background="neutral100" hasRadius direction="row" justifyContent="space-between" alignItems="center" className={styles.playerItem} paddingTop={3} paddingBottom={3} paddingLeft={6} paddingRight={6}>
                                        <Label variant="lg">{player[1].name}</Label>
                                        {gameData?.owner && (
                                            <FaTimes
                                                className={styles.kickButton}
                                                onClick={() => {
                                                    kick(player[0]);
                                                }}
                                            />
                                        )}
                                    </Flex>
                                );
                            })
                        ) : (
                            <Flex justifyContent="center" className={styles.players}>
                                <Label variant="lg" color="neutral200">
                                    Waiting for players...
                                </Label>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Container>
        </FullSection>
    );
};

export default Waiting;
