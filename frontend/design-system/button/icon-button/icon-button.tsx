import { Box } from '@design-system/layout/box';
import { useTheme } from '@design-system/theme';
import { Label } from '@design-system/typography';
import classNames from 'classnames';
import { ReactNode } from 'react';
import styles from './icon-button.module.scss';

type ButtonProps = {
    icon: ReactNode;
    disabled?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export const IconButton: React.FC<ButtonProps> = ({ icon, disabled, ...rest }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className={classNames(styles.baseButton)} disabled={disabled} aria-disabled={disabled} {...rest}>
            <Box className={styles.iconWrapper}>{icon}</Box>
        </button>
    );
};
