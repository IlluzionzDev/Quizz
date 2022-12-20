import { Box } from '@design-system/layout/box';
import styles from './modal.module.scss';

export const ModalBody: React.FC = ({ children }) => {
    return (
        <Box className={styles.modalBody} padding={7}>
            {children}
        </Box>
    );
}