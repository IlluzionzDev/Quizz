import { Portal } from '@design-system/layout/portal';
import { DismissableLayer } from './dismissable-layer';
import { ModalContext } from './modal-context';
import styles from './modal.module.scss';

type ModalLayoutProps = {
    onClose: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const ModalLayout: React.FC<ModalLayoutProps> = ({ children, onClose, ...rest }) => {
    return (
        <Portal wrapperId="modal">
            <ModalContext.Provider value={{ onClose }}>
                <div className={styles.modalWrapper}>
                    <DismissableLayer onEscapeKeyDown={onClose} onPointerDownOutside={onClose}>
                        <div className={styles.modalContent} role="dialog" onClick={(e) => e.stopPropagation()} {...rest}>
                            {children}
                        </div>
                    </DismissableLayer>
                </div>
            </ModalContext.Provider>
        </Portal>
    );
};
