import styles from './game-over.module.scss';
import { disconnect, useClient, useRequireGame } from 'api';
import { SPlayerData } from 'api/packets/server';
import { useAppDispatch, useAppSelector } from 'hooks';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CenterSection, FullSection } from '@design-system/layout/section';
import Navigation from '@components/layout/navigation';
import { TextButton } from '@design-system/button';
import { Flex } from '@design-system/layout/flex';
import { Heading, Label } from '@design-system/typography';
import { Badge } from '@design-system/badge';
import { Container } from '@design-system/layout/container';
import { TightContainer } from '@design-system/layout/container/container';
import { Variants } from 'framer-motion';

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
                return b.score - a.score;
            })
            .slice(0, 3);
    }

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

    return (
        <FullSection>
            <Navigation backlink={<TextButton onClick={() => disconnect(dispatch)}>{gameData?.owner ? 'End Game' : 'Leave'}</TextButton>} />
            <CenterSection>
                <TightContainer>
                    <Flex direction="column" gap={11} variants={loadInTop} initial="hidden" animate="show">
                        <Heading element="h1" variant="heading-1" variants={loadInTop}>
                            {gameData?.title}
                        </Heading>
                        <Flex direction="column" paddingTop={5} className={styles.players} gap={4} alignItems="center">
                            {topPlayers().map((player, id) => {
                                return (
                                    <Flex
                                        key={id}
                                        direction="row"
                                        background="neutral100"
                                        className={styles.player}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        hasRadius
                                        paddingLeft={6}
                                        paddingRight={6}
                                        paddingTop={3}
                                        paddingBottom={3}
                                        variants={loadInTop}
                                    >
                                        <Flex direction="row" gap={2}>
                                            <Label variant="lg">#{id + 1}</Label>
                                            <Label variant="lg">{player.name}</Label>
                                        </Flex>

                                        <Badge variant="active">{player.score}</Badge>
                                    </Flex>
                                );
                            })}
                        </Flex>
                    </Flex>
                </TightContainer>
            </CenterSection>
        </FullSection>
    );
};

export default GameOver;
