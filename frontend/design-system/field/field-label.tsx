import { Label } from "@design-system/typography";

/**
 * Label describing a field
 */
export const FieldLabel: React.FC = ({ children, ...rest }) => {
    return (
        <Label variant="md" color="black">{children}</Label>
    );
};
