import { Container } from '@design-system/layout/container';
import { Flex } from '@design-system/layout/flex';
import { ReactNode } from 'react';

type NavigationProps = {
    backlink: ReactNode; // Name of button
};

// Refactor to actual navigation components
const Navigation: React.FC<NavigationProps> = ({ backlink }) => (
    <Container>
        <Flex direction="row" paddingTop={6} paddingBottom={6}>
            <ul>
                <li>{backlink}</li>
            </ul>
        </Flex>
    </Container>
);

export default Navigation;
