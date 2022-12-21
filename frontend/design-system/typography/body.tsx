import { useTheme } from '@design-system/theme';
import classNames from 'classnames';
import { CSSProperties } from 'react';
import styles from './typography.module.scss';

type BodyProps = {
    variant: 'xl' | 'lg' | 'md' | 'sm';
    color?: string;
    highlight?: boolean;
    className?: CSSProperties | string;
} & React.HTMLAttributes<HTMLParagraphElement>;

export const Body: React.FC<BodyProps> = ({ children, className, variant, color, highlight = false, ...rest }) => {
    const { theme, toggleTheme } = useTheme();

    // Define styling
    const stylingName = 'body-' + variant + (highlight ? '-highlight' : '');
    const colors = {
        color: color ? 'var(--' + color + ')' : undefined
    };

    return (
        <p style={colors} className={classNames(styles[stylingName], className)} {...rest}>
            {children}
        </p>
    );
};
