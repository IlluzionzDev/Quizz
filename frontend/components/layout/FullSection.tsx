import styles from './FullSection.module.scss';

const FullSection: React.FC = ({ children }) => (
    <div className={styles.section}>
        {children}
    </div>
);

export default FullSection;
