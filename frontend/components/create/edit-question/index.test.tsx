import { ThemeProvider } from '@illuzionz-studios/design-system';
import { EditQuestion } from '.';
import { QuestionData } from 'api/packets/packets';
import { fireEvent, getByText, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const question: QuestionData = {
    question: 'My Test Question',
    answers: ['Answer One', 'Answer Two'],
    correct: [0]
};

describe('Calls Handlers', () => {
    test('Calls onEdit', () => {
        let calledEdit = false;
        const onEdit = () => {
            calledEdit = true;
        };

        let result = render(
            <ThemeProvider>
                <EditQuestion question={question} onEdit={onEdit} onDelete={(_) => {}}></EditQuestion>
            </ThemeProvider>
        );

        // Click button
        const editButton = result.container.querySelector('#edit');
        fireEvent.click(editButton!!);

        expect(calledEdit).toBeTruthy();
    });

    test('Calls onDelete', () => {
        let calledDelete = false;
        const onDelete = () => {
            calledDelete = true;
        };

        let result = render(
            <ThemeProvider>
                <EditQuestion question={question} onEdit={(_) => {}} onDelete={onDelete}></EditQuestion>
            </ThemeProvider>
        );

        // Click button
        const deleteButton = result.container.querySelector('#delete');
        fireEvent.click(deleteButton!!);

        expect(calledDelete).toBeTruthy();
    });
});

test('Renders Component', () => {
    render(
        <ThemeProvider>
            <EditQuestion question={question} onEdit={(_) => {}} onDelete={(_) => {}}></EditQuestion>
        </ThemeProvider>
    );

    const foundQuestion = screen.getByText(/My Test Question/);
    expect(foundQuestion).toBeInTheDocument();
});
