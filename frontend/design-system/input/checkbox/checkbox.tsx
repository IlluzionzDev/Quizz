import { Box } from '@design-system/layout/box';
import { ChangeEventHandler, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import styles from './checkbox.module.scss';

type CheckboxInputProps = {
    checked: boolean;
    disabled?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
} & React.HTMLAttributes<HTMLInputElement>;

/**
 * Base check box styling. Exposes control variables
 */
export const CheckboxInput: React.FC<CheckboxInputProps> = ({ checked, disabled, onChange, ...rest }) => {
    const checkBox = useRef<HTMLInputElement>(null);

    return (
        <Box>
            {checked && <FaCheck className={styles.check} aria-disabled={disabled} onClick={() => checkBox?.current?.click()} />}
            <input type="checkbox" ref={checkBox} className={styles.checkbox} name="test" checked={checked} onChange={onChange} disabled={disabled} {...rest} />
        </Box>
    );
};
