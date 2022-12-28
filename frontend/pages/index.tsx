/* eslint-disable @next/next/link-passhref */
import { Button } from '@design-system/button';
import { Box } from '@design-system/layout/box';
import { Container } from '@design-system/layout/container';
import { TightContainer } from '@design-system/layout/container/container';
import { Flex } from '@design-system/layout/flex';
import { CenterSection, FullSection } from '@design-system/layout/section';
import { ThemeSwitcher } from '@design-system/theme';
import { Body, Heading } from '@design-system/typography';
import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import Link from 'next/link';
import { FaPen, FaPlay, FaTimes } from 'react-icons/fa';
import styles from './index.module.scss';

const Home: NextPage = () => {
    return (
        <FullSection>
            {/* <Box className={styles.themeSwitcher}>
                <ThemeSwitcher />
            </Box> */}
            <CenterSection>
                <TightContainer>
                    <Flex direction="column" gap={9}>
                        <Flex direction="column" gap={2}>
                            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeInOut', duration: 0.6 }}>
                                <Heading element="h1" variant="display">
                                    Quiz your friends in real-time
                                </Heading>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeInOut', duration: 0.6, delay: 0.05 }}>
                                <Body variant="xl">Quizz allows you to create quizzes and then quiz your friends in real-time. Compete for the highest score and see who is all knowing.</Body>
                            </motion.div>
                        </Flex>
                        <Flex direction="row" gap={6} justifyContent="center">
                            <Link href="/join-quiz">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.1
                                    }}
                                >
                                    <Button variant="primary" startIcon={<FaPlay />}>
                                        Join Quiz
                                    </Button>
                                </motion.div>
                            </Link>

                            <Link href="/create-quiz">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.2
                                    }}
                                >
                                    <Button variant="primary" startIcon={<FaPen />}>
                                        Create Quiz
                                    </Button>
                                </motion.div>
                            </Link>
                        </Flex>
                    </Flex>
                </TightContainer>
            </CenterSection>
        </FullSection>
    );
};

export default Home;
