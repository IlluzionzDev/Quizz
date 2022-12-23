import { useTheme } from '@design-system/theme';
import classNames from 'classnames';
import { CSSProperties } from 'react';
import styles from './typography.module.scss';

type LabelProps = {
    variant: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'button';
    color?: string;
    className?: CSSProperties | string;
} & React.HTMLAttributes<HTMLSpanElement>;

export const Label: React.FC<LabelProps> = ({ children, className, variant, color, ...rest}) => {
    const { theme, toggleTheme } = useTheme();

    // Define styling
    const stylingName = variant === 'button' ? 'button-text' : 'label-' + variant;
    const colors = {
        color: color ? 'var(--' + color + ')' : undefined
    };

    return (
        <span style={colors} className={classNames(styles[stylingName], className)} {...rest}>
            {children}
        </span>
    );
};
