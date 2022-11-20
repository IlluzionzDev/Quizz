import styles from './create-quiz.module.scss';
import { useClient } from 'api';
import { createGame } from 'api/packets/client';
import type { NextPage } from 'next';
import { useState } from 'react';
import PlayerNav from '@components/layout/PlayerNav';
import FullSection from '@components/layout/FullSection';
import CreateQuestionModal from '@components/create/CreateQuestionModal';
import { QuestionData } from 'api/packets/packets';
import { FaPen, FaTimes } from 'react-icons/fa';

const CreateQuiz: NextPage = () => {
    const client = useClient();

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

    function quizTitle(e: React.FormEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value);
    }

    /**
     * Validate questions and create quiz if okay
     */
    function createQuiz() {
        // Validations

        client?.send(createGame(title, questions));
    }

    // Modal for creating question

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
            <PlayerNav backlink="/" title="Create Quiz" />
            <div className={`container ${styles['create-quiz']}`}>
                <input type="text" className={styles.quiz__title} placeholder="Enter Quiz Title" name="quiz_title" value={title} onChange={quizTitle} />

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
            </div>
        </FullSection>
    );
};

export default CreateQuiz;
