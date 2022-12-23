import styles from './game-over.module.scss';
import { disconnect, useClient, useRequireGame } from 'api';
import { SPlayerData } from 'api/packets/server';
import { useAppDispatch, useAppSelector } from 'hooks';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CenterSection, FullSection } from '@design-system/layout/section';

const GameOver: NextPage = () => {
    useClient();
    useRequireGame();

    const router = useRouter();

    // State
    const dispatch = useAppDispatch();
    const gameData = useAppSelector((state) => state.client.gameData);
    const players = useAppSelector((state) => state.client.players);

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
            .slice(0, 3);
    }

    return (
        <FullSection>
            <CenterSection>
                <h1>Results</h1>
                <div className={styles.players}>
                    {topPlayers().map((player, id) => {
                        return (
                            <div key={id} className={styles.players__player}>
                                <p>#{id + 1}</p>
                                <p>{player.name}</p>

                                <div className={styles.players__player__score}>{player.score}</div>
                            </div>
                        );
                    })}
                </div>
            </CenterSection>
        </FullSection>
    );
};

export default GameOver;
