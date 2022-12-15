import FullSection from '@components/layout/FullSection';
import { Button } from '@design-system/button';
import { Box } from '@design-system/layout/box';
import { Container } from '@design-system/layout/container';
import { Flex } from '@design-system/layout/flex';
import { useTheme } from '@design-system/theme';
import { Body, Heading, Label } from '@design-system/typography';
import { NextPage } from 'next';

const Testing: NextPage = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className='lightTheme'>
            <FullSection>
                <Container>
                    <Flex direction="column" padding={4} justifyContent="center" gap={3}>
                        <Heading element="h1" variant="heading-1" color="primary600">
                            Test
                        </Heading>
                        <Box>
                            <Label variant="xl">Example Label</Label>
                            <Box background="tertiary200" padding={2} hasRadius>
                                <Body variant="lg" color="white">
                                    Example Text
                                </Body>
                            </Box>
                        </Box>

                        <Button onClick={() => toggleTheme()}>Change Theme</Button>
                    </Flex>
                </Container>
            </FullSection>
        </div>
    );
};

export default Testing;
