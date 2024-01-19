import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
    // Cleanup render after each test has completed
    cleanup();
});
