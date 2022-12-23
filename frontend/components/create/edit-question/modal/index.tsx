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
                        <Flex direction="row" gap={2} alignItems="center">
                            <Label variant="lg">Answers</Label>
                            <Label variant="md" color={questionData.answers.length >= 4 ? 'neutral900' : 'neutral500'}>
                                {questionData.answers.length}/4
                            </Label>
                        </Flex>
                        <Flex direction="column" gap={4}>
                            {questionData.answers.length != 0 ? (
                                questionData.answers.map((answer, id) => {
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
                                                        const modifiedAnswers = questionData.answers.map((a, i) => {
                                                            if (i == id) {
                                                                return e.currentTarget.value;
                                                            } else {
                                                                return a;
                                                            }
                                                        });
                                                        setQuestionData({ question: questionData.question, answers: modifiedAnswers, correct: questionData.correct });
                                                    }}
                                                />
                                            </Flex>
                                            <Flex alignItems="center">
                                                <FaTrash
                                                    className={styles.answerDelete}
                                                    onClick={(e) => {
                                                        const newAnswers = questionData.answers.filter((_, index) => {
                                                            return index !== id;
                                                        });
                                                        setQuestionData({ question: questionData.question, answers: newAnswers, correct: questionData.correct });
                                                    }}
                                                />
                                            </Flex>
                                        </Flex>
                                    );
                                })
                            ) : (
                                <Flex justifyContent="center">
                                    <Label variant="lg" color="neutral200">
                                        No Answers...
                                    </Label>
                                </Flex>
                            )}
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
                        <Button
                            variant="secondary"
                            startIcon={<FaPlus />}
                            disabled={questionData.answers.length >= 4}
                            onClick={() => {
                                // Max 4 answers
                                if (questionData.answers.length >= 4) return;

                                setQuestionData({ question: questionData.question, answers: [...questionData.answers, ''], correct: questionData.correct });
                            }}
                        >
                            Add Answer
                        </Button>
                        <Button
                            variant="primary"
                            disabled={questionData.answers.includes('') || questionData.answers.length <= 0 || questionData.question.length === 0 || questionData.correct.length <= 0}
                            onClick={() => {
                                setSubmitted(true);

                                // Make sure at least is correct
                                if (questionData.correct.length <= 0) return;
                                // Make sure all answers are filled
                                if (questionData.answers.includes('')) return;
                                // Make sure has at least 1 answer
                                if (questionData.answers.length <= 0) return;
                                // Make sure question has name
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
