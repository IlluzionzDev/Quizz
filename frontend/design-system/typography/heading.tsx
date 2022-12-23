import { useTheme } from '@design-system/theme';
import classNames from 'classnames';
import { CSSProperties } from 'react';
import styles from './typography.module.scss';

type HeadingProps = {
    element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    variant: 'hero' | 'display' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5';
    color?: string;
    regular?: boolean;
    className?: CSSProperties | string;
} & React.HTMLAttributes<HTMLHeadingElement>;

export const Heading: React.FC<HeadingProps> = ({ children, className, element = 'h1', variant, color, regular = false, ...rest}) => {
    const { theme, toggleTheme } = useTheme();

    const Element = element;

    // Define styling
    const stylingName = variant + (regular ? '-regular' : '');
    const colors = {
        color: color ? 'var(--' + color + ')' : undefined
    };

    return (
        <Element style={colors} className={classNames(styles[stylingName], className)} {...rest}>
            {children}
        </Element>
    );
};
