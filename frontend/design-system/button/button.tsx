import { useTheme } from '@design-system/theme';
import { Label } from '@design-system/typography';
import styles from './button.module.scss';

type ButtonProps = {
    onClick?: () => {};
} & React.HTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={onClick} className={styles.primaryButton}>
            <Label variant="button">{children}</Label>
        </button>
    );
};
