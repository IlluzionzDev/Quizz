import { Flex } from "@design-system/layout/flex";
import classNames from "classnames";
import { CSSProperties } from "react";
import { Field } from "./field";
import { FieldError } from "./field-error";
import { FieldInput } from "./field-input";
import { FieldLabel } from "./field-label";
import styles from './field.module.scss';

type TextFieldProps = {
    className?: CSSProperties | string;
    disabled?: boolean;
    value: string;
    name: string;
    id: string;
    label?: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Master component for a field of text
 */
export const TextField: React.FC<TextFieldProps> = ({ className, disabled, value, name, id, label, error, ...rest }) => {
    return (
        <Field id={id} name={name} error={error} className={classNames(styles.field, className)}>
            <Flex direction="column" gap={1}>
                {label && <FieldLabel>{label}</FieldLabel>}
                <FieldInput value={value} disabled={disabled} {...rest}/>
                <FieldError />
            </Flex>
        </Field>
    )
};
