import { ThemeProvider } from '@illuzionz-studios/design-system';
import { QuestionData } from 'api/packets/packets';
import 'jest-styled-components';
import { EditQuestionModal } from '.';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import { ReactNode, ReactPortal } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock create portal for modal
const oldCreatePortal = ReactDOM.createPortal;
beforeAll(() => {
    ReactDOM.createPortal = (node: ReactNode): ReactPortal => node as ReactPortal;
});

afterAll(() => {
    ReactDOM.createPortal = oldCreatePortal;
});

it('Renders Edit Question Modal', () => {
    const question: QuestionData = {
        question: 'My Test Question',
        answers: ['Answer One', 'Answer Two'],
        correct: [0]
    };

    const tree = renderer
        .create(
            <ThemeProvider>
                <EditQuestionModal question={question} onClose={() => {}} onSubmit={(_) => {}}></EditQuestionModal>
            </ThemeProvider>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

describe('Integration Tests', () => {
    it('Updates Question', () => {
        let updatedQuestion: QuestionData = {
            question: '',
            answers: [],
            correct: []
        };

        let resultQuestion: QuestionData = {
            question: 'Test Title',
            answers: ['Answer One'],
            correct: [0]
        };

        const result = render(
            <ThemeProvider>
                <EditQuestionModal
                    question={updatedQuestion}
                    onClose={() => {}}
                    onSubmit={(saved) => {
                        updatedQuestion = saved;
                    }}
                ></EditQuestionModal>
            </ThemeProvider>
        );

        // Enter title
        const titleInput = result.container.querySelector('#quizTitle');
        expect(titleInput).toBeInTheDocument();
        fireEvent.change(titleInput!!, { target: { value: 'Test Title' } });

        // Add an answer
        const addAnswerButton = result.container.querySelector('#add-answer');
        fireEvent.click(addAnswerButton!!);
        const enterAnswerInput = screen.getByPlaceholderText(/Enter Answer/);
        fireEvent.change(enterAnswerInput!!, { target: { value: 'Answer One' } });

        // Set as correct answer
        const correctAnswerInput = result.container.querySelector('#correctAnswer');
        fireEvent.click(correctAnswerInput!!);

        // Submit edit
        const submitButton = result.container.querySelector('#submit');
        fireEvent.click(submitButton!!);

        expect(updatedQuestion).toEqual(resultQuestion);
    });

    it('Cancels without Saving', () => {
        let updatedQuestion: QuestionData = {
            question: '',
            answers: [],
            correct: []
        };

        let wasClosed = false;

        const result = render(
            <ThemeProvider>
                <EditQuestionModal
                    question={updatedQuestion}
                    onClose={() => {
                        wasClosed = true;
                    }}
                    onSubmit={(saved) => {
                        updatedQuestion = saved;
                    }}
                ></EditQuestionModal>
            </ThemeProvider>
        );

        // Enter some info
        const titleInput = result.container.querySelector('#quizTitle');
        expect(titleInput).toBeInTheDocument();
        fireEvent.change(titleInput!!, { target: { value: 'Test Title' } });

        // Click cancel button
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);

        // Should not save data and call close method
        expect(wasClosed).toBeTruthy();
        // Ensure wasn't updated
        expect(updatedQuestion).toEqual(updatedQuestion);
    });
});
