import { useCallback, useEffect, useRef } from "react";

type DismissableLayerProps = {
    onEscapeKeyDown: (event: KeyboardEvent) => void;
    onPointerDownOutside: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const DismissableLayer: React.FC<DismissableLayerProps> = ({ children, onEscapeKeyDown, onPointerDownOutside, ...rest }) => {
    const layerRef = useRef<HTMLDivElement>(null);
    const onEscapeKeyDownHandler = useCallback(onEscapeKeyDown, [onEscapeKeyDown]);
    const onPointerDownOutsideHandler = useCallback(onPointerDownOutside, [onPointerDownOutside]);

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

    // Handle click outside modal
    useEffect(() => {
        const handlePointerDownOutside = (event: PointerEvent) => {
            /**
             * Because certain elements that live inside modals e.g. Selects
             * render their dropdowns in portals the `layerRef.current.contains(event.target)` fails.
             *
             * Therefore we check the closest portal of the DimissibleLayer (which we're trying to close)
             * and the event that _may_ prematurely close the layer and see if they are equal.
             */
            const dismissibleLayersReactPortal = layerRef.current?.closest('[data-react-portal]');
            const eventsReactPortal = (event.target as HTMLElement).closest('[data-react-portal]');

            if (layerRef.current && !layerRef.current.contains(event.currentTarget as Node) && dismissibleLayersReactPortal === eventsReactPortal) {
                onPointerDownOutsideHandler();
            }
        };

        document.addEventListener('pointerdown', handlePointerDownOutside);

        return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
    }, [onPointerDownOutsideHandler]);

    return (
        <div ref={layerRef} {...rest}>
            {children}
        </div>
    );
};
