import { useTheme } from '@design-system/theme';
import classNames from 'classnames';
import { HTMLMotionProps, motion, MotionStyle } from 'framer-motion';
import { CSSProperties } from 'react';
import styles from './typography.module.scss';

type HeadingProps = {
    element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    variant: 'hero' | 'display' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5';
    color?: string;
    regular?: boolean;
    className?: CSSProperties | string;
} & HTMLMotionProps<'h1'>;

export const Heading: React.FC<HeadingProps> = ({ children, className, element = 'h1', variant, color, regular = false, ...rest }) => {
    // Define styling
    const stylingName = variant + (regular ? '-regular' : '');
    const colors: CSSProperties | MotionStyle = {
        color: color ? 'var(--' + color + ')' : undefined
    };

    switch (element) {
        case 'h1':
            return (
                <motion.h1 style={colors} className={classNames(styles[stylingName], className)} {...rest}>
                    {children}
                </motion.h1>
            );
        case 'h2':
            return (
                <motion.h1 style={colors} className={classNames(styles[stylingName], className)} {...rest}>
                    {children}
                </motion.h1>
            );
        case 'h3':
            return (
                <motion.h1 style={colors} className={classNames(styles[stylingName], className)} {...rest}>
                    {children}
                </motion.h1>
            );
        case 'h4':
            return (
                <motion.h1 style={colors} className={classNames(styles[stylingName], className)} {...rest}>
                    {children}
                </motion.h1>
            );
        case 'h5':
            return (
                <motion.h1 style={colors} className={classNames(styles[stylingName], className)} {...rest}>
                    {children}
                </motion.h1>
            );
        default:
            return (
                <motion.h1 style={colors} className={classNames(styles[stylingName], className)} {...rest}>
                    {children}
                </motion.h1>
            );
    }
};
