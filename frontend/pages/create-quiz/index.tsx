import styles from './create-quiz.module.scss';
import { send, useClient, useGameState } from 'api';
import { createGame } from 'api/packets/client';
import type { NextPage } from 'next';
import { createRef, useRef, useState } from 'react';
import CreateQuestionModal from '@components/create/CreateQuestionModal';
import { GameState, QuestionData } from 'api/packets/packets';
import { FaArrowLeft, FaArrowRight, FaDownload, FaPen, FaPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { CenterSection, FullSection } from '@design-system/layout/section';
import Navigation from '@components/layout/navigation';
import { TextButton } from '@design-system/button';
import { Container } from '@design-system/layout/container';
import { Flex } from '@design-system/layout/flex';
import { Heading, Label } from '@design-system/typography';
import { TextField } from '@design-system/field';
import { Box } from '@design-system/layout/box';
import { EditQuestion, EditQuestionModal } from '@components/create/edit-question';

/**
 * Model of quiz configuration
 */
interface QuizConfig {
    title: string;
    questions: QuestionData[];
}

const CreateQuiz: NextPage = () => {
    useClient();
    const router = useRouter();

    // Store quiz title
    const [title, setTitle] = useState('');

    // Store quiz questions
    const [questions, setQuestions] = useState<QuestionData[]>([
        {
            question: 'Test',
            answers: ['Answer One', 'Answer Two', 'Answer Three', 'Answer Four'],
            correct: [0]
        }
    ]);

    // Index of question being editing, -1 if none
    const [editingQuestion, setEditingQuestion] = useState(-1);

    // If to display the creating question modal
    const [createQuestionModal, setCreateQuestionModal] = useState(false);

    // If submitted to create quiz
    const [submitted, setSubmitted] = useState(false);

    // Element for importing quiz
    const importQuiz = createRef<HTMLInputElement>();

    // When game created, enters waiting state so redirect to waiting room
    useGameState(GameState.WAITING, () => {
        router.push('/waiting');
    });

    /**
     * Validate questions and create quiz if okay
     */
    function createQuiz() {
        setSubmitted(true);

        // Make sure has a title
        if (!title) return;
        // Make sure has atleast one question
        if (questions.length === 0) return;

        send(createGame(title, questions));
    }

    /**
     * Load a quiz file into state
     */
    async function importFile() {
        // Get file input
        const input: HTMLInputElement = importQuiz.current!;

        // File uploaded
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            // Try load config
            try {
                const config = await loadQuiz(file);

                setTitle(config.title);
                setQuestions(config.questions);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * Export quiz to JSON file
     */
    function exportFile() {
        // Get state to use
        const quizTitle = title;
        const quizQuestions = questions;

        const data = JSON.stringify({ title: quizTitle, questions: quizQuestions });

        // Download data file
        const URL = window.webkitURL ?? window.URL;
        const id = 'tmpDownload';

        // Create temp clickable button
        let element: HTMLAnchorElement =
            (document.getElementById(id) as HTMLAnchorElement | null) ??
            ((): HTMLAnchorElement => {
                const element = document.createElement('a') as HTMLAnchorElement;
                element.id = id;
                return element;
            })();
        const safeName: string = title.replace(/[ ^\/]/g, '_');

        // Create data blog
        const blob = new Blob([data], { type: 'application/json' });

        // Allow button to download element
        element.download = safeName + '.json';
        element.href = URL.createObjectURL(blob);
        element.dataset.downloadurl = ['application/json', element.download, element.href].join(':');
        element.style.display = 'none';

        // Download
        element.click();
    }

    /**
     * Make a promise to load a quiz config from a JSON file
     */
    function loadQuiz(file: File): Promise<QuizConfig> {
        return new Promise<QuizConfig>(async (resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result) {
                    // Read file as json
                    const raw: string = reader.result as string;
                    const json: QuizConfig = JSON.parse(raw) as QuizConfig;
                    resolve(json);
                }
            };

            // Log loading error
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    return (
        <FullSection>
            {createQuestionModal && (
                <EditQuestionModal
                    onClose={() => {
                        setCreateQuestionModal(false);

                        // No longer editing after close
                        setEditingQuestion(-1);
                    }}
                    onSubmit={(question: QuestionData) => {
                        // Close modal
                        setCreateQuestionModal(false);

                        const questionsArray = questions;
                        if (editingQuestion == -1) {
                            questionsArray.push(question);
                        } else {
                            questionsArray[editingQuestion] = question;
                        }
                        setQuestions(questionsArray);

                        // No longer editing after submit
                        setEditingQuestion(-1);
                    }}
                    // Parse fresh question data or clone exising question data for editing
                    question={editingQuestion === -1 ? { question: '', answers: [], correct: [] } : structuredClone(questions[editingQuestion])}
                />
            )}
            <Navigation
                backlink={
                    <TextButton onClick={() => router.push('/')} startIcon={<FaArrowLeft />}>
                        Go Back
                    </TextButton>
                }
            />
            <CenterSection>
                <Container>
                    <Flex direction="column" padding={7} gap={7} alignItems="center" className={styles.mainSection}>
                        <Heading element="h1" variant="heading-1">
                            Create Quiz
                        </Heading>
                        <TextField
                            error={submitted && title.length == 0 ? 'Please enter quiz title' : ''}
                            id="quizTitle"
                            name="quiz title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.currentTarget.value);
                                if (submitted) setSubmitted(false);
                            }}
                            placeholder="Title"
                            label="Enter Quiz Title"
                        />
                        <Flex background="white" className={styles.questionsBox} padding={4} direction="column" gap={3} hasRadius>
                            {questions.length != 0 ? (
                                questions.map((question, id) => {
                                    return (
                                        <EditQuestion
                                            key={id}
                                            question={question}
                                            onEdit={(question: QuestionData) => {
                                                setEditingQuestion(id);

                                                // Open model
                                                setCreateQuestionModal(true);
                                            }}
                                            onDelete={(question: QuestionData) => {
                                                const newQuestions = questions.filter((_, index) => {
                                                    return index !== id;
                                                });
                                                setQuestions(newQuestions);
                                            }}
                                        />
                                    );
                                })
                            ) : (
                                <Flex justifyContent='center'>
                                    <Label variant='lg' color='neutral200'>No Questions...</Label>
                                </Flex>
                            )}
                            <Flex direction="row" justifyContent="flex-end">
                                <TextButton
                                    onClick={() => {
                                        setCreateQuestionModal(true);
                                    }}
                                    startIcon={<FaPlus />}
                                >
                                    Add Question
                                </TextButton>
                            </Flex>
                        </Flex>
                        <Flex gap={2}>
                            <input type="file" ref={importQuiz} onChange={importFile} style={{ display: 'none' }} />
                            <TextButton
                                onClick={() => {
                                    importQuiz.current?.click();
                                }}
                                endIcon={<FaUpload />}
                            >
                                Import
                            </TextButton>
                            <TextButton onClick={exportFile} endIcon={<FaDownload />}>
                                Export
                            </TextButton>
                            <TextButton onClick={createQuiz} endIcon={<FaArrowRight />}>
                                Create Quiz
                            </TextButton>
                        </Flex>
                    </Flex>
                </Container>
            </CenterSection>
        </FullSection>
    );
};

export default CreateQuiz;
