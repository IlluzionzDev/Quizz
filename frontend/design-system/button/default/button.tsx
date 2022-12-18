import { Box } from '@design-system/layout/box';
import { useTheme } from '@design-system/theme';
import { Label } from '@design-system/typography';
import classNames from 'classnames';
import { ReactNode } from 'react';
import styles from './button.module.scss';

// All types of buttons
type ButtonVariants = 'primary' | 'secondary' | 'tertiary' | 'success' | 'success-light' | 'error' | 'error-light';

type ButtonProps = {
    variant: ButtonVariants;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({ children, variant, startIcon, endIcon, disabled, fullWidth, ...rest }) => {
    const { theme, toggleTheme } = useTheme();

    const variantStyle = disabled ? '' : variant + 'Button';

    return (
        <button className={classNames(styles.baseButton, styles[variantStyle], fullWidth ? styles.fullWidth : '')} disabled={disabled} aria-disabled={disabled} {...rest}>
            {startIcon && <Box className={styles.iconWrapper}>{startIcon}</Box>}
            <Label variant="button">{children}</Label>
            {endIcon && <Box className={styles.iconWrapper}>{endIcon}</Box>}
        </button>
    );
};
