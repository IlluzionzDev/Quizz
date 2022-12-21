import { TextInput } from "@design-system/input/text";
import { useField } from "./field-context";

type FieldInputProps = {
    disabled?: boolean;
    value: string;
};

/**
 * Expose all variables to a field
 */
export const FieldInput: React.FC<FieldInputProps> = ({ disabled, value, ...rest }) => {
    const { id, name, error } = useField();

    return <TextInput value={value} hasError={Boolean(error)} id={id} {...rest} />;
};
