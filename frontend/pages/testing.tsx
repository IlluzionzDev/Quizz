import FullSection from '@components/layout/FullSection';
import { Button, IconButton, TextButton } from '@design-system/button';
import { CheckboxInput } from '@design-system/input/checkbox';
import { TextInput } from '@design-system/input/text';
import { Box } from '@design-system/layout/box';
import { Container } from '@design-system/layout/container';
import { Flex } from '@design-system/layout/flex';
import { useTheme } from '@design-system/theme';
import { Body, Heading, Label } from '@design-system/typography';
import { NextPage } from 'next';
import { useState } from 'react';
import { FaPlay, FaSun } from 'react-icons/fa';

const Testing: NextPage = () => {
    const { theme, toggleTheme } = useTheme();

    const [testCheck, setTestCheck] = useState(false);
    const [testText, setTestText] = useState('');

    return (
        <div className="lightTheme">
            <FullSection>
                <Container>
                    <Flex direction="column" padding={4} justifyContent="center" gap={3}>
                        <Heading element="h1" variant="heading-1" color="primary600">
                            Component Testing
                        </Heading>
                        <Box>
                            <Label variant="xl">Example Label</Label>
                            <Box background="tertiary200" padding={2} hasRadius>
                                <Body variant="lg" color="gray800">
                                    Example Text
                                </Body>
                            </Box>
                        </Box>
                        <Flex direction="row" gap={2} wrap="wrap" justifyContent="space-between" alignItems="center">
                            <Button onClick={() => toggleTheme()} variant="primary" startIcon={<FaSun />}>
                                Change Theme
                            </Button>
                            <Button onClick={() => toggleTheme()} variant="secondary" startIcon={<FaSun />}>
                                Change Theme
                            </Button>
                            <Button onClick={() => toggleTheme()} variant="tertiary" startIcon={<FaSun />}>
                                Change Theme
                            </Button>
                            <Button onClick={() => toggleTheme()} variant="success" startIcon={<FaSun />}>
                                Change Theme
                            </Button>
                            <Button onClick={() => toggleTheme()} variant="success-light" startIcon={<FaSun />}>
                                Change Theme
                            </Button>
                            <Button onClick={() => toggleTheme()} variant="error" startIcon={<FaSun />}>
                                Change Theme
                            </Button>
                            <Button onClick={() => toggleTheme()} variant="error-light" startIcon={<FaSun />}>
                                Change Theme
                            </Button>
                            <TextButton onClick={() => toggleTheme()} startIcon={<FaSun />}>
                                Change Theme
                            </TextButton>
                            <IconButton onClick={() => toggleTheme()} icon={<FaSun />} />
                        </Flex>

                        <Box>
                            <CheckboxInput checked={testCheck} onChange={(e) => setTestCheck(e.currentTarget.checked)} />
                            <TextInput value={testText} onChange={(e) => setTestText(e.currentTarget.value)} placeholder={'Test Text'} />
                        </Box>
                    </Flex>
                </Container>
            </FullSection>
        </div>
    );
};

export default Testing;
