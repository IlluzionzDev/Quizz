import styles from './section.module.scss';

export const FullSection: React.FC = ({ children }) => {
    return <div className={styles.fullSection}>
        {children}
    </div>
}