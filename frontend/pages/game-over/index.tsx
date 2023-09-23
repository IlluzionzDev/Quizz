import styles from './game-over.module.scss';
import { disconnect, useClient, useRequireGame } from 'api';
import { SPlayerData } from 'api/packets/server';
import { useAppDispatch, useAppSelector } from 'hooks';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Navigation from '@components/layout/navigation';
import { Variants } from 'framer-motion';
import { Badge, CenterSection, Flex, FullSection, Label, TextButton, TightContainer } from '@illuzionz-studios/design-system';
import { MotionFlex, MotionHeading } from '@components/motion';

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
                    <MotionFlex direction="column" gap={11} variants={loadInTop} initial="hidden" animate="show">
                        <MotionHeading element="h1" variant="heading-1" variants={loadInTop}>
                            {gameData?.title}
                        </MotionHeading>
                        <Flex direction="column" paddingTop={5} className={styles.players} gap={4} alignItems="center">
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
                                        <Flex direction="row" gap={2}>
                                            <Label variant="lg">#{id + 1}</Label>
                                            <Label variant="lg">{player.name}</Label>
                                        </Flex>

                                        <Badge variant="primary">{player.score}</Badge>
                                    </MotionFlex>
                                );
                            })}
                        </Flex>
                    </MotionFlex>
                </TightContainer>
            </CenterSection>
        </FullSection>
    );
};

export default GameOver;
