import { ThemeProvider } from '@illuzionz-studios/design-system';
import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Toast } from './toast';
import { ToastData, ToastProvider } from './toast-provider';
import { ToastContext } from './toast-context';
import { ToastContainer } from './toast-container';

const testData: ToastData = {
    title: 'Test Toast',
    content: 'This is my content',
    backgroundColor: 'success300',
    color: 'white'
};

test('Renders Toast', () => {
    render(
        <ThemeProvider>
            <ToastContainer data={[testData]} />
        </ThemeProvider>
    );

    expect(screen.getByText(/Test Toast/)).toBeInTheDocument();
});

describe('Toast State Operations', () => {
    test('Opens Toast', () => {
        render(
            <ThemeProvider>
                <ToastProvider>
                    <ToastContext.Consumer>
                        {(value) => (
                            <div>
                                <button data-testid="open-button" onClick={() => value.open(testData)}></button>
                            </div>
                        )}
                    </ToastContext.Consumer>
                </ToastProvider>
            </ThemeProvider>
        );

        const openButton = screen.getByTestId('open-button');

        act(() => {
            fireEvent.click(openButton);
        });

        // Test toast was added
        expect(screen.getByText(/Test Toast/)).toBeInTheDocument();
    });
});
