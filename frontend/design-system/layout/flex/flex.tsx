import { useTheme } from '@design-system/theme';
import { Box, BoxProps } from '@design-system/layout/box';

type FlexTypes = {
    alignItems?: string;
    justifyContent?: string;
    inline?: boolean;

    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    shrink?: string;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: number;
} & BoxProps;

/**
 * A box container that acts as a flex parent. Allows properties of a box
 * but also allows you to align content
 */
export const Flex: React.FC<FlexTypes> = ({
    children,
    alignItems,
    justifyContent,
    inline = false,

    direction,
    shrink,
    wrap,
    gap,
    ...rest
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Box
            inlineStyle={{
                alignItems: alignItems,
                justifyContent: justifyContent,
                display: inline ? 'inline-flex' : 'flex',

                flexDirection: direction,
                flexShrink: shrink,
                flexWrap: wrap,
                gap: gap ? theme.spaces[gap] : undefined
            }}
            {...rest}
        >
            {children}
        </Box>
    );
};
