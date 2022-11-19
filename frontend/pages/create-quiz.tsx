import styles from './create-quiz.module.scss';
import CenterSection from '@components/layout/CenterSection';
import { useClient } from 'api';
import { createGame } from 'api/packets/client';
import type { NextPage } from 'next';
import { useState } from 'react';
import PlayerNav from '@components/layout/PlayerNav';
import FullSection from '@components/layout/FullSection';

const CreateQuiz: NextPage = () => {
    const client = useClient();

    // Store quiz title
    const [title, setTitle] = useState('');

    // Store quiz questions
    const [questions, setQuestions] = useState([]);

    function quizTitle(e: React.FormEvent<HTMLInputElement>) {
        setTitle(e.currentTarget.value);
    }

    /**
     * Validate questions and create quiz if okay
     */
    function createQuiz() {
        // Validations

        client?.send(createGame(title, []));
    }

    // Modal for creating question

    return (
        <FullSection>
            <PlayerNav backlink="/" title="Create Quiz" />
            <div className={`container ${styles['create-quiz']}`}>
                <input type="text" className={styles.quiz__title} placeholder="Enter Quiz Title" name="quiz_title" value={title} onChange={quizTitle} />

                <div className={styles.questions}>
                    <h3>Questions</h3>

                    <div className={`${styles.questions} ${styles.questions__box}`}>
                        {questions.map((question, id) => {
                            return <p key={id}>{question}</p>;
                        })}

                        <button className={`button button__outline ${styles.questions__add}`}>Add Question</button>
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
