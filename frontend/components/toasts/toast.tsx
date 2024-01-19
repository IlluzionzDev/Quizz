import { MotionFlex } from '@components/motion';
import { Body, Box, Flex, Label } from '@illuzionz-studios/design-system';
import { PropsWithChildren } from 'react';

export type ToastProps = {
    title: string;
    color: string;
    backgroundColor: string;
};

export const Toast: React.FC<PropsWithChildren<ToastProps>> = ({ children, title, color, backgroundColor }) => {
    return (
        <MotionFlex
            initial={{
                x: 100
            }}
            animate={{
                x: 0
            }}
            exit={{
                opacity: 0,
                x: 200
            }}
            direction="column"
            gap={2}
            color={color}
            padding={3}
            background={backgroundColor}
            radius="md"
        >
            <Label variant="xl">{title}</Label>
            <Body variant="md">{children}</Body>
        </MotionFlex>
    );
};
