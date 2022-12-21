import { Button } from '@design-system/button';
import { Flex } from '@design-system/layout/flex';
import { CenterSection, FullSection } from '@design-system/layout/section';
import { Body, Heading } from '@design-system/typography';
import type { NextPage } from 'next';
import Link from 'next/link';
import { FaPen, FaPlay, FaTimes } from 'react-icons/fa';

const Home: NextPage = () => {
    return (
        <FullSection>
            <CenterSection>
                <Flex direction="column" gap={9}>
                    <Flex direction="column" gap={2}>
                        <Heading element="h1" variant="display">
                            Quiz your friends in real-time
                        </Heading>
                        <Body variant="xl">Quizz allows you to create quizzes and then quiz your friends in real-time. Compete for the highest score and see who is all knowing.</Body>
                    </Flex>
                    <Flex direction="row" gap={6} justifyContent="center">
                        <Link href="/join-quiz" passHref>
                            <Button variant="primary" startIcon={<FaPlay />}>
                                Join Quiz
                            </Button>
                        </Link>

                        <Link href="/create-quiz" passHref>
                            <Button variant="primary" startIcon={<FaPen />}>
                                Create Quiz
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
            </CenterSection>
        </FullSection>
    );
};

export default Home;
