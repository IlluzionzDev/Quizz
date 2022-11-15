import styles from './CenterSection.module.scss';

const CenterSection: React.FC = ({ children }) => (
  <div className={styles.section}>
    <div className={styles.section__inner}>{children}</div>
  </div>
);

export default CenterSection;
