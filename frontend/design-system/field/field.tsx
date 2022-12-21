import { FieldContext } from './field-context';

type FieldProps = {
    id: string;
    name: string;
    error?: string;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Expose all variables to a field
 */
export const Field: React.FC<FieldProps> = ({ children, id, name, error, ...rest }) => {
    return (
        <div style={{ textAlign: 'left' }} {...rest}>
            <FieldContext.Provider value={{ id, name, error }}>{children}</FieldContext.Provider>
        </div>
    );
};
