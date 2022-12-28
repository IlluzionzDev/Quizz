import { Box } from '@design-system/layout/box';
import { useTheme } from '@design-system/theme';
import { Label } from '@design-system/typography';
import classNames from 'classnames';
import { motion } from 'framer-motion';
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

    // Hover animation based on button state
    const buttonHover = {
        scale: disabled ? 1 : 1.05
    }

    return (
        <motion.div transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }} initial={{ scale: 1 }} whileHover={buttonHover}>
            <button className={classNames(styles.baseButton, styles[variantStyle], fullWidth ? styles.fullWidth : '')} disabled={disabled} aria-disabled={disabled} {...rest}>
                {startIcon && <Box className={styles.iconWrapper}>{startIcon}</Box>}
                <Label variant="button">{children}</Label>
                {endIcon && <Box className={styles.iconWrapper}>{endIcon}</Box>}
            </button>
        </motion.div>
    );
};
