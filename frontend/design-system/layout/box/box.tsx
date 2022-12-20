import { useTheme } from '@design-system/theme';
import { CSSProperties } from 'react';

// Allow css rules
export type BoxProps = {
    className?: CSSProperties | string;
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
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A div container that maintains the specs of our design system.
 * Use this for in place of a div where we need consistent spacing, colours
 * etc. This will auto convert input to the specs of our design system.
 */
export const Box: React.FC<BoxProps> = ({
    children,
    className,
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
        <div
            className={className}
            style={{
                ...inlineStyle,
                backgroundColor: background ? 'var(--' + background + ')' : undefined,
                color: color ? 'var(--' + color + ')' : undefined,
                borderColor: borderColor ? 'var(--' + borderColor + ')' : undefined,

                borderRadius: hasRadius ? theme.borderRadius : undefined,

                padding: padding ? theme.spaces[padding] : undefined,
                paddingBottom: paddingBottom ? theme.spaces[paddingBottom] : undefined,
                paddingLeft: paddingLeft ? theme.spaces[paddingLeft] : undefined,
                paddingTop: paddingTop ? theme.spaces[paddingTop] : undefined,
                paddingRight: paddingRight ? theme.spaces[paddingRight] : undefined,

                margin: margin ? theme.spaces[margin] : undefined,
                marginBottom: marginBottom ? theme.spaces[marginBottom] : undefined,
                marginLeft: marginLeft ? theme.spaces[marginLeft] : undefined,
                marginTop: marginTop ? theme.spaces[marginTop] : undefined,
                marginRight: marginRight ? theme.spaces[marginRight] : undefined,

                flex,
                flexShrink: shrink,
                flexGrow: grow,
                flexBasis: basis
            }}
            {...rest}
        >
            {children}
        </div>
    );
};
