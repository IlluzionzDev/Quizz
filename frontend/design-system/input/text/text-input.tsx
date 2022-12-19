import { useField } from '@design-system/field/field-context';
import classNames from 'classnames';
import { ChangeEventHandler } from 'react';
import styles from './text-input.module.scss';

type TextInputProps = {
    disabled?: boolean;
    value: string;
    hasError?: boolean;
} & React.HTMLAttributes<HTMLInputElement>;

/**
 * The raw styled text input
 */
export const TextInput: React.FC<TextInputProps> = ({ value, hasError, disabled, ...rest }) => {
    const { id, name, error } = useField();

    let ariaDesc;

    if (hasError) {
        ariaDesc = `${id}-error`;
    }

    return (
        <input 
        type="text" 
        name={name} 
        className={classNames(styles.input, (hasError ? styles.error : ''))} 
        disabled={disabled} 
        aria-disabled={disabled}
        arai-describedby={ariaDesc}
        value={value}
        {...rest}/>
    );
};
