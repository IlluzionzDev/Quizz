import styles from './container.module.scss';

export const Container: React.FC = ({ children }) => {
    return <div className={styles.container}>{children}</div>;
};

// Container that wraps content tightly
export const TightContainer: React.FC = ({ children }) => {
    return <div className={styles.containerTight}>{children}</div>
}