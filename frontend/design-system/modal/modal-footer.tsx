import { IconButton } from '@design-system/button';
import { Box } from '@design-system/layout/box';
import { Flex } from '@design-system/layout/flex';
import { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useModal } from './modal-context';
import styles from './modal.module.scss';

type ModalFooterType = {
    startActions: ReactNode;
    endActions: ReactNode;
};

export const ModalFooter: React.FC<ModalFooterType> = ({ startActions, endActions }) => {
    return (
        <Box className={styles.modalFooter} paddingTop={4} paddingBottom={4} paddingLeft={5} paddingRight={5} background="gray100">
            <Flex direction="row" alignItems="center"  justifyContent="space-between">
                <Flex direction="row" gap={1}>
                    {startActions}
                </Flex>
                <Flex direction="row" gap={1}>
                    {endActions}
                </Flex>
            </Flex>
        </Box>
    );
};
