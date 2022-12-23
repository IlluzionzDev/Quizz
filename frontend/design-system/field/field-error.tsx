import { Label } from "@design-system/typography";
import { useField } from "./field-context";

/**
 * Displays field error
 */
export const FieldError: React.FC = () => {
    const { id, name, error } = useField();

    // Only render if error
    if (!error || typeof error !== 'string') return null;

    return (
        <Label variant="sm" color="error500" id={`${id}-error`}>{error}</Label>
    );
};
