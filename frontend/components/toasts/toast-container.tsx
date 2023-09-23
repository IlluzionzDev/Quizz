import { Flex } from '@illuzionz-studios/design-system';
import { ToastData } from './toast-provider';
import styles from './toasts.module.scss';
import { Toast } from './toast';
import { AnimatePresence } from 'framer-motion';

type ToastContainerProps = {
    data: ToastData[];
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ data }) => {
    return (
        <Flex direction="column" gap={2} className={styles.toastWrapper}>
            <AnimatePresence mode="sync">
                {data.map((toast, id) => (
                    <Toast key={id} title={toast.title} color={toast.color} backgroundColor={toast.backgroundColor}>
                        {toast.content}
                    </Toast>
                ))}
            </AnimatePresence>
        </Flex>
    );
};
