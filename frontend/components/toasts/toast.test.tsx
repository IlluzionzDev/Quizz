import { ThemeProvider } from '@illuzionz-studios/design-system';
import { fireEvent, render, screen } from '@testing-library/react';
import { Toast } from './toast';
import { ToastData, ToastProvider } from './toast-provider';
import { ToastContext } from './toast-context';

test('Renders Toast', () => {
    const result = render(
        <ThemeProvider>
            <Toast title="Test Toast" backgroundColor="success300" color="white">
                This is my content
            </Toast>
        </ThemeProvider>
    );

    expect(screen.getByText(/Test Toast/)).toBeInTheDocument();
});

describe('Toast State Operations', () => {
    const testData: ToastData = {
        title: 'Test Toast',
        content: 'This is my content',
        backgroundColor: 'success300',
        color: 'white'
    };

    test('Open and Closes Toast', () => {
        let toastId = '';

        const result = render(
            <ThemeProvider>
                <ToastProvider>
                    <ToastContext.Consumer>
                        {(value) => (
                            <div>
                                <button data-testid="open-button" onClick={() => (toastId = value.open(testData))}></button>
                                <button data-testid="close-button" onClick={() => value.close(toastId)}></button>
                            </div>
                        )}
                    </ToastContext.Consumer>
                </ToastProvider>
            </ThemeProvider>
        );

        const openButton = screen.getByTestId('open-button');
        fireEvent.click(openButton);

        console.log('Created toast with id: ', toastId);

        // Test toast was added
        expect(screen.getByText(/Test Toast/)).toBeInTheDocument();

        // Then remove toast
        const closeButton = screen.getByTestId('close-button');
        fireEvent.click(closeButton);

        // Check was removed
        expect(screen.getByText(/Test Toast/)).not.toBeInTheDocument();
    });
});
