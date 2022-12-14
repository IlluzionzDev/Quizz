import FullSection from "@components/layout/FullSection";
import { Box } from "@design-system/layout/box";
import { useTheme } from "@design-system/theme";
import { NextPage } from "next";

const Testing: NextPage = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <FullSection>
            <h1>Test</h1>
            <Box background="tertiary200">
                test
            </Box>
            <button onClick={() => toggleTheme()}>
                Change Theme
            </button>
        </FullSection>
    );
};

export default Testing;
