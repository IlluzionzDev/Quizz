import styles from './container.module.scss';

export const Container: React.FC = ({ children }) => {
    return <div className={styles.container}>{children}</div>;
};
