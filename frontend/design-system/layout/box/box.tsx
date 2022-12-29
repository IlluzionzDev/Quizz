import { useTheme } from '@design-system/theme';
import { HTMLMotionProps, motion } from 'framer-motion';
import { CSSProperties } from 'react';

// Allow css rules
export type BoxProps = {
    inlineStyle?: CSSProperties;
    background?: string;
    color?: string;
    borderColor?: string;

    hasRadius?: boolean;

    padding?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingTop?: number;
    paddingRight?: number;
    margin?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginTop?: number;
    marginRight?: number;

    flex?: string;
    shrink?: string;
    grow?: string;
    basis?: string;
} & HTMLMotionProps<'div'>;

/**
 * A div container that maintains the specs of our design system.
 * Use this for in place of a div where we need consistent spacing, colours
 * etc. This will auto convert input to the specs of our design system.
 */
export const Box: React.FC<BoxProps> = ({
    children,
    inlineStyle,
    background,
    color,
    borderColor,

    hasRadius,

    padding,
    paddingBottom,
    paddingLeft,
    paddingTop,
    paddingRight,
    margin,
    marginBottom,
    marginLeft,
    marginTop,
    marginRight,

    flex,
    shrink,
    grow,
    basis,
    ...rest
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.div
            style={{
                ...inlineStyle,
                backgroundColor: background ? 'var(--' + background + ')' : undefined,
                color: color ? 'var(--' + color + ')' : undefined,
                borderColor: borderColor ? 'var(--' + borderColor + ')' : undefined,

                borderRadius: hasRadius ? theme.borderRadius : undefined,

                // Set all values with master padding
                paddingBottom: paddingBottom ? theme.spaces[paddingBottom] : padding ? theme.spaces[padding] : undefined,
                paddingLeft: paddingLeft ? theme.spaces[paddingLeft] : padding ? theme.spaces[padding] : undefined,
                paddingTop: paddingTop ? theme.spaces[paddingTop] : padding ? theme.spaces[padding] : undefined,
                paddingRight: paddingRight ? theme.spaces[paddingRight] : padding ? theme.spaces[padding] : undefined,

                // Set all values with master margin
                marginBottom: marginBottom ? theme.spaces[marginBottom] : margin ? theme.spaces[margin] : undefined,
                marginLeft: marginLeft ? theme.spaces[marginLeft] : margin ? theme.spaces[margin] : undefined,
                marginTop: marginTop ? theme.spaces[marginTop] : margin ? theme.spaces[margin] : undefined,
                marginRight: marginRight ? theme.spaces[marginRight] : margin ? theme.spaces[margin] : undefined,

                flex,
                flexShrink: shrink,
                flexGrow: grow,
                flexBasis: basis
            }}
            {...rest}
        >
            {children}
        </motion.div>
    );
};
