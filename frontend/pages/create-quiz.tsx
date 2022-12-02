import styles from './create-quiz.module.scss';
import { send, useClient, useGameState } from 'api';
import { createGame } from 'api/packets/client';
import type { NextPage } from 'next';
import { createRef, useRef, useState } from 'react';
import PlayerNav from '@components/layout/PlayerNav';
import FullSection from '@components/layout/FullSection';
import CreateQuestionModal from '@components/create/CreateQuestionModal';
import { GameState, QuestionData } from 'api/packets/packets';
import { FaPen, FaTimes, FaUpload } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Container from '@components/layout/Container';

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
    const [questions, setQuestions] = useState<QuestionData[]>([]);

    // Active question editing session data
    const [question, setQuestion] = useState<QuestionData>({ question: '', answers: [], correct: [] });

    // Index of question being editing, -1 if none
    const [editingQuestion, setEditingQuestion] = useState(-1);

    // If to display the creating question modal
    const [createQuestionModal, setCreateQuestionModal] = useState(false);

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
        console.log('Test');

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
            <CreateQuestionModal
                isOpen={createQuestionModal}
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
                question={question}
                setQuestion={setQuestion}
            />
            <PlayerNav
                onBack={() => {
                    router.push('/');
                }}
                backlink="Go Back"
                title="Create Quiz"
            />
            <Container>
                <div className={`${styles['create-quiz']}`}>
                    <input
                        type="text"
                        className={styles.quiz__title}
                        placeholder="Enter Quiz Title"
                        name="quiz_title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.currentTarget.value);
                        }}
                    />

                    <div className={styles.questions}>
                        <h3>Questions</h3>

                        <div className={`${styles.questions} ${styles.questions__box}`}>
                            {questions.map((question, id) => {
                                return (
                                    <div key={id} className={styles.questions__question}>
                                        <div className={styles.questions__question__title}>{question.question}</div>
                                        <div className={styles.questions__question__edit}>
                                            <FaPen
                                                className={styles.questions__question__edit__item}
                                                onClick={(e) => {
                                                    const questionData = questions[id];

                                                    setEditingQuestion(id);
                                                    setQuestion(questionData);

                                                    // Open model
                                                    setCreateQuestionModal(true);
                                                }}
                                            />
                                            <FaTimes
                                                className={styles.questions__question__edit__item}
                                                onClick={(e) => {
                                                    const newQuestions = questions.filter((_, index) => {
                                                        return index !== id;
                                                    });
                                                    setQuestions(newQuestions);
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                className={`button button__outline ${styles.questions__add}`}
                                onClick={() => {
                                    // Make sure active session is cleared
                                    setQuestion({ question: '', answers: [], correct: [] });

                                    setCreateQuestionModal(true);
                                }}
                            >
                                Add Question
                            </button>
                        </div>
                    </div>

                    <button className={`button button__solid ${styles.create__button}`} onClick={createQuiz}>
                        Create Quiz
                    </button>

                    <label>
                        <button
                            className="button button__outline"
                            onClick={() => {
                                importQuiz.current?.click();
                            }}
                        >
                            Import Quiz
                        </button>
                        <input type="file" ref={importQuiz} onChange={importFile} style={{ display: 'none' }} />
                    </label>

                    <button className="button button__outline" onClick={exportFile}>
                        Export Quiz
                    </button>
                </div>
            </Container>
        </FullSection>
    );
};

export default CreateQuiz;
