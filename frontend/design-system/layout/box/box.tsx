import { useTheme } from "@design-system/theme"

// Allow css rules
type BoxProps = {
    background?: string,
    color?: string,

    hasRadius?: boolean,

    padding?: number,
    paddingBottom?: number,
    paddingLeft?: number,
    paddingTop?: number,
    paddingRight?: number
} & React.HTMLAttributes<HTMLDivElement>

export const Box: React.FC<BoxProps> = ({
    children,
    background,
    color,

    hasRadius,

    padding,
    paddingBottom,
    paddingLeft,
    paddingTop,
    paddingRight
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div
            style={{
                backgroundColor: theme.colors[background || 'white']
            }}
        >
            {children}
        </div>
    );
};