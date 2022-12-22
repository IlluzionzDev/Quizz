import { Button } from '@design-system/button';
import { TextField } from '@design-system/field';
import { CheckboxInput } from '@design-system/input/checkbox';
import { Flex } from '@design-system/layout/flex';
import { ModalBody, ModalFooter, ModalHeader, ModalLayout } from '@design-system/modal';
import { Label } from '@design-system/typography';
import { QuestionData } from 'api/packets/packets';
import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import styles from './edit-question-modal.module.scss';

type EditQuestionModalProps = {
    question: QuestionData;
    onClose: () => void;
    onSubmit: (question: QuestionData) => void;
};

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ question, onClose, onSubmit }) => {
    // Temp question to update data on
    const [questionData, setQuestionData] = useState({
        question: question.question,
        answers: question.answers,
        correct: question.correct
    });

    // If submitted updated data
    const [submitted, setSubmitted] = useState(false);

    return (
        <ModalLayout onClose={onClose}>
            <ModalHeader>Edit Question</ModalHeader>
            <ModalBody>
                <Flex direction="column" gap={4}>
                    <TextField
                        id="quizTitle"
                        name="quiz title"
                        error={submitted && questionData.question.length === 0 ? 'Please enter question title' : ''}
                        label="Question Title"
                        value={questionData.question}
                        onChange={(e) => {
                            const text = e.currentTarget.value;
                            const answers = questionData.answers;
                            const correct = questionData.correct;
                            setQuestionData({ question: text, answers, correct });
                            if (submitted) setSubmitted(false);
                        }}
                    />
                    <Flex direction="column" gap={2}>
                        <Label variant="lg">Answers</Label>
                        <Flex direction="column" gap={4}>
                            {questionData.answers.map((answer, id) => {
                                const checked = questionData.correct.includes(id);

                                return (
                                    <Flex key={id} direction="row" justifyContent="space-between" background="neutral100" alignItems="center" paddingTop={2} paddingBottom={2} paddingLeft={6} paddingRight={6} hasRadius>
                                        <Flex direction="row" gap={4} alignItems="center">
                                            <CheckboxInput
                                                checked={checked}
                                                onChange={(e) => {
                                                    var correctAnswers = questionData.correct;
                                                    if (checked) {
                                                        correctAnswers = correctAnswers.filter((value) => {
                                                            return value !== id;
                                                        });
                                                    } else {
                                                        correctAnswers.push(id);
                                                    }
                                                    setQuestionData({ question: questionData.question, answers: questionData.answers, correct: correctAnswers });
                                                }}
                                            />
                                            <input
                                                className={styles.answerInput}
                                                type="text"
                                                value={answer}
                                                placeholder="Enter Answer"
                                                onChange={(e) => {
                                                    const modifiedAnswers = question.answers.map((a, i) => {
                                                        if (i == id) {
                                                            return e.currentTarget.value;
                                                        } else {
                                                            return a;
                                                        }
                                                    });
                                                    setQuestionData({ question: question.question, answers: modifiedAnswers, correct: question.correct });
                                                }}
                                            />
                                        </Flex>
                                        <Flex alignItems="center">
                                            <FaTrash
                                                className={styles.answerDelete}
                                                onClick={(e) => {
                                                    const newAnswers = question.answers.filter((_, index) => {
                                                        return index !== id;
                                                    });
                                                    setQuestionData({ question: question.question, answers: newAnswers, correct: question.correct });
                                                }}
                                            />
                                        </Flex>
                                    </Flex>
                                );
                            })}
                        </Flex>
                    </Flex>
                </Flex>
            </ModalBody>
            <ModalFooter
                startActions={
                    <Button variant="tertiary" onClick={onClose}>
                        Cancel
                    </Button>
                }
                endActions={
                    <>
                        <Button variant="secondary" startIcon={<FaPlus />}>
                            Add Answer
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setSubmitted(true);

                                if (questionData.question.length === 0) return;

                                onSubmit(questionData);
                            }}
                        >
                            Save
                        </Button>
                    </>
                }
            />
        </ModalLayout>
    );
};
