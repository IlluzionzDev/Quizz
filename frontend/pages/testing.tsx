import { FullSection } from '@design-system/layout/section';
import { Badge } from '@design-system/badge';
import { Button, IconButton, TextButton } from '@design-system/button';
import { TextField } from '@design-system/field';
import { CheckboxInput } from '@design-system/input/checkbox';
import { TextInput } from '@design-system/input/text';
import { Box } from '@design-system/layout/box';
import { Container } from '@design-system/layout/container';
import { Flex } from '@design-system/layout/flex';
import { ModalBody, ModalFooter, ModalHeader, ModalLayout } from '@design-system/modal';
import { useTheme } from '@design-system/theme';
import { Body, Heading, Label } from '@design-system/typography';
import { NextPage } from 'next';
import { useState } from 'react';
import { FaPlay, FaSun } from 'react-icons/fa';

const Testing: NextPage = () => {
    const { theme, toggleTheme } = useTheme();

    const [testCheck, setTestCheck] = useState(false);
    const [testText, setTestText] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div>
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
                            <TextField
                                id="test"
                                name="test"
                                label="Test Field"
                                value={testText}
                                onChange={(e) => setTestText(e.currentTarget.value)}
                                placeholder="Test Text"
                                error={testText.length <= 3 ? 'Text must be greater than 3 characters' : ''}
                            />
                            <Badge variant="active">Test</Badge>
                            <Button variant="primary" onClick={() => setIsVisible((prev) => !prev)}>
                                Open Modal
                            </Button>
                        </Box>
                    </Flex>
                </Container>
            </FullSection>
            {isVisible && (
                <ModalLayout onClose={() => setIsVisible((prev) => !prev)}>
                    <ModalHeader>Test</ModalHeader>
                    <ModalBody>
                        <Heading element="h1" variant="heading-1">
                            Modal Header
                        </Heading>
                        <Flex direction="column" gap={3}>
                            {Array(50)
                                .fill(null)
                                .map((_, index) => (
                                    <Box key={`box-${index}`} padding={5} background="neutral100" hasRadius>
                                        Hello world
                                    </Box>
                                ))}
                        </Flex>
                    </ModalBody>
                    <ModalFooter
                        startActions={
                            <>
                                <Button variant="tertiary" onClick={() => setIsVisible((prev) => !prev)}>
                                    Cancel
                                </Button>
                            </>
                        }
                        endActions={
                            <>
                                <Button variant="primary" onClick={() => setIsVisible((prev) => !prev)}>
                                    Done
                                </Button>
                            </>
                        }
                    />
                </ModalLayout>
            )}
        </div>
    );
};

export default Testing;
