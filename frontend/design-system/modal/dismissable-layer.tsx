import { useCallback, useEffect, useRef } from "react";

type DismissableLayerProps = {
    onEscapeKeyDown: (event: KeyboardEvent) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const DismissableLayer: React.FC<DismissableLayerProps> = ({ children, onEscapeKeyDown, ...rest }) => {
    const layerRef = useRef<HTMLDivElement>(null);
    const onEscapeKeyDownHandler = useCallback(onEscapeKeyDown, [onEscapeKeyDown]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscapeKeyDownHandler(event);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onEscapeKeyDownHandler]);

    return (
        <div ref={layerRef} {...rest}>
            {children}
        </div>
    );
};
