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
    return (
        <input type="text" className={classNames(styles.input, (hasError ? styles.error : ''))} disabled={disabled} aria-disabled={disabled} value={value} {...rest}/>
    );
};
