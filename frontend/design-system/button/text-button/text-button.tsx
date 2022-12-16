import { Box } from '@design-system/layout/box';
import { useTheme } from '@design-system/theme';
import { Label } from '@design-system/typography';
import classNames from 'classnames';
import { ReactNode } from 'react';
import styles from './text-button.module.scss';

type ButtonProps = {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export const TextButton: React.FC<ButtonProps> = ({ children, startIcon, endIcon, disabled, fullWidth, ...rest }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className={classNames(styles.baseButton, fullWidth ? styles.fullWidth : '')} disabled={disabled} aria-disabled={disabled} {...rest}>
            {startIcon && <Box className={styles.iconWrapper}>{startIcon}</Box>}
            <Label variant="button">{children}</Label>
            {endIcon && <Box className={styles.iconWrapper}>{endIcon}</Box>}
        </button>
    );
};
