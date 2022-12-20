import { Box } from '@design-system/layout/box';
import styles from './modal.module.scss';

export const ModalBody: React.FC = ({ children }) => {
    return (
        // <Box className={styles.modalBody} paddingTop={7} paddingLeft={7} paddingBottom={7} paddingRight={7}>
        //     {children}
        // </Box>
        <Box className={styles.modalBody} padding={7} margin={5}>
            {children}
        </Box>
    );
}