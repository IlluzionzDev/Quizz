import { HTMLMotionProps, motion } from 'framer-motion';
import { FieldContext } from './field-context';

type FieldProps = {
    id: string;
    name: string;
    error?: string;
} & HTMLMotionProps<'div'>;

/**
 * Expose all variables to a field
 */
export const Field: React.FC<FieldProps> = ({ children, id, name, error, ...rest }) => {
    return (
        <motion.div style={{ textAlign: 'left' }} {...rest}>
            <FieldContext.Provider value={{ id, name, error }}>{children}</FieldContext.Provider>
        </motion.div>
    );
};
