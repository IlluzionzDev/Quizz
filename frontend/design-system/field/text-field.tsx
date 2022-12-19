import { Flex } from "@design-system/layout/flex";
import { Field } from "./field";
import { FieldError } from "./field-error";
import { FieldInput } from "./field-input";
import { FieldLabel } from "./field-label";

type TextFieldProps = {
    disabled?: boolean;
    value: string;
    name: string;
    id: string;
    label?: string;
    error?: string;
} & React.HTMLAttributes<HTMLInputElement>;

/**
 * Master component for a field of text
 */
export const TextField: React.FC<TextFieldProps> = ({ disabled, value, name, id, label, error, ...rest }) => {
    return (
        <Field id={id} name={name} error={error}>
            <Flex direction="column" gap={1}>
                {label && <FieldLabel>{label}</FieldLabel>}
                <FieldInput value={value} disabled={disabled} {...rest}/>
                <FieldError />
            </Flex>
        </Field>
    )
};
