import styles from './CreateQuestionModal.module.scss';
import Link from 'next/link';
import { QuestionData } from 'api/packets/packets';
import ReactPortal from '@components/layout/ReactPortal';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import QuestionAnswers from './QuestionAnswers';

type CreateQuestionModalProps = {
    isOpen: boolean;
    onSubmit: (question: QuestionData) => void;
    onClose: () => void;
    question: QuestionData;
    setQuestion: Dispatch<SetStateAction<QuestionData>>;
};

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({ isOpen, onSubmit, onClose, question, setQuestion }) => {
    // Close modal on escape key
    useEffect(() => {
        const closeOnEscapeKey = (e: KeyboardEvent) => (e.key === 'Escape' ? onClose() : null);
        document.body.addEventListener('keydown', closeOnEscapeKey);
        return () => {
            document.body.removeEventListener('keydown', closeOnEscapeKey);
        };
    }, [onClose]);

    // Don't render if not open
    if (!isOpen) return null;

    return (
        <ReactPortal wrapperId="modal-portal">
            <div className={styles.modal}>
                <div className={`${styles.modal} ${styles.modal__content}`}>
                    <div className={styles.question}>
                        <input
                            type="text"
                            className={styles.question__title}
                            placeholder="Enter Question"
                            name="question_title"
                            value={question.question}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const text = e.currentTarget.value;
                                const answers = question.answers;
                                const correct = question.correct;
                                setQuestion({ question: text, answers, correct });
                            }}
                        />

                        <h3>Answers</h3>
                        <QuestionAnswers question={question} setQuestion={setQuestion} />
                    </div>

                    <div className="button__row">
                        <button
                            className="button button__solid"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            Close
                        </button>
                        <button
                            className="button button__solid"
                            onClick={() => {
                                // TODO: Notify can't submit blank question
                                onSubmit(question);

                                // Clear state
                                setQuestion({ question: '', answers: [], correct: [] });
                            }}
                            disabled={!question.question}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </ReactPortal>
    );
};

export default CreateQuestionModal;
