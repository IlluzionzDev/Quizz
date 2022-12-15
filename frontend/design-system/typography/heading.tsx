import { useTheme } from '@design-system/theme';
import styles from './typography.module.scss';

type HeadingProps = {
    element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    variant: 'hero' | 'display' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5';
    color?: string;
    regular?: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>;

export const Heading: React.FC<HeadingProps> = ({ children, element = 'h1', variant, color, regular = false, ...rest}) => {
    const { theme, toggleTheme } = useTheme();

    const Element = element;

    // Define styling
    const stylingName = variant + (regular ? '-regular' : '');
    const colors = {
        color: color ? theme.colors[color] : undefined
    };

    return <Element style={colors} className={styles[stylingName]} {...rest}>{children}</Element>;
};
