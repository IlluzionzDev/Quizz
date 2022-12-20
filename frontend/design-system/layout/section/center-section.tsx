import styles from './section.module.scss';

export const CenterSection: React.FC = ({ children }) => {
    return (
        <div className={styles.centerSection}>
            <div className={styles.centerSection__inner}>{children}</div>
        </div>
    );
};
