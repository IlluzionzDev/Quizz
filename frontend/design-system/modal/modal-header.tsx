import { IconButton } from '@design-system/button';
import { Box } from '@design-system/layout/box';
import { Flex } from '@design-system/layout/flex';
import { FaTimes } from 'react-icons/fa';
import { useModal } from './modal-context';
import styles from './modal.module.scss';

export const ModalHeader: React.FC = ({ children }) => {
    const { onClose } = useModal();

    return (
        <Box className={styles.modalHeader} paddingTop={4} paddingBottom={4} paddingLeft={5} paddingRight={5} background="gray100">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
                {children}
                <IconButton icon={<FaTimes />} onClick={onClose}/>
            </Flex>
        </Box>
    );
};
