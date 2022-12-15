import { useTheme } from '@design-system/theme';
import styles from './typography.module.scss';

type BodyProps = {
    variant: 'xl' | 'lg' | 'md' | 'sm';
    color?: string;
    highlight?: boolean;
} & React.HTMLAttributes<HTMLParagraphElement>;

export const Body: React.FC<BodyProps> = ({ children, variant, color, highlight = false, ...rest }) => {
    const { theme, toggleTheme } = useTheme();

    // Define styling
    const stylingName = 'body-' + variant + (highlight ? '-highlight' : '');
    const colors = {
        color: color ? theme.colors[color] : undefined
    };

    return (
        <p style={colors} className={styles[stylingName]} {...rest}>
            {children}
        </p>
    );
};
