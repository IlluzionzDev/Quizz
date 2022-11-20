import { QuestionData } from 'api/packets/packets';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from './QuestionAnswers.module.scss';
import { FaTimes } from 'react-icons/fa';

type QuestionAnswersProps = {
    question: QuestionData;
    setQuestion: Dispatch<SetStateAction<QuestionData>>;
};

// Pass in state management from parent
const QuestionAnswers: React.FC<QuestionAnswersProps> = ({ question, setQuestion }) => {
    function addBlankAnswer() {
        setQuestion({ question: question.question, answers: [...question.answers, ''], correct: question.correct });
    }

    return (
        <div className={styles.answers}>
            <ul className={styles.answers__box}>
                {question.answers.map((answer, id) => {
                    const checked = question.correct.includes(id);

                    return (
                        <li key={id}className={styles.answers__answer}>
                            <input
                                type="checkbox"
                                className={`${styles.answers__answer__select} ${checked && styles.answers__answer__select__selected}`}
                                name="answer_correct"
                                checked={checked}
                                onChange={(e) => {
                                    var correctAnswers = question.correct;
                                    if (checked) {
                                        correctAnswers = correctAnswers.filter((value) => {
                                            return value !== id;
                                        });
                                    } else {
                                        correctAnswers.push(id);
                                    }
                                    setQuestion({ question: question.question, answers: question.answers, correct: correctAnswers });
                                }}
                            />

                            <input
                                type="text"
                                className={styles.answers__answer__title}
                                placeholder="Enter Answer"
                                name="answer_title"
                                value={answer}
                                onChange={(e) => {
                                    const modifiedAnswers = question.answers.map((a, i) => {
                                        if (i == id) {
                                            return e.currentTarget.value;
                                        } else {
                                            return a;
                                        }
                                    });
                                    setQuestion({ question: question.question, answers: modifiedAnswers, correct: question.correct });
                                }}
                            />

                            <FaTimes className={styles.answers__answer__delete} onClick={(e) => {
                                const newAnswers = question.answers.filter((_, index) => {
                                    return index !== id;
                                })
                                setQuestion({ question: question.question, answers: newAnswers, correct: question.correct });
                            }}/>
                        </li>
                    );
                })}
            </ul>

            <button className={`button button__outline ${styles.answers__add}`} onClick={addBlankAnswer}>
                Add Answer
            </button>
        </div>
    );
};

export default QuestionAnswers;
