import { useTheme } from '@design-system/theme';
import styles from './typography.module.scss';

type LabelProps = {
    variant: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'button';
    color?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export const Label: React.FC<LabelProps> = ({ children, variant, color, ...rest}) => {
    const { theme, toggleTheme } = useTheme();

    // Define styling
    const stylingName = variant === 'button' ? 'button-text' : 'label-' + variant;
    const colors = {
        color: color ? theme.colors[color] : undefined
    };

    return (
        <span style={colors} className={styles[stylingName]} {...rest}>
            {children}
        </span>
    );
};
