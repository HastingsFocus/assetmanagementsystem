import { useId, isValidElement, cloneElement } from "react";

/**
 * Field — a labelled form control wrapper that guarantees the label is
 * associated with its input (accessibility) and renders help/error text.
 *
 * Usage:
 *   <Field label="Email" required>
 *     <Input type="email" name="email" value={...} onChange={...} />
 *   </Field>
 *
 * The single child control automatically receives a generated `id` (unless
 * it already has one) so that <label htmlFor> points at the right element.
 */
export const Field = ({ label, hint, error, required, children }) => {
  const generatedId = useId();

  const control =
    isValidElement(children) && !children.props.id
      ? cloneElement(children, { id: generatedId })
      : children;

  const controlId = isValidElement(control) ? control.props.id : undefined;

  return (
    <div>
      {label ? (
        <label htmlFor={controlId} className="label">
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </label>
      ) : null}

      {control}

      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
};

export const Input = (props) => <input className="input" {...props} />;

export const Select = ({ children, ...props }) => (
  <select className="select" {...props}>
    {children}
  </select>
);

export const Textarea = (props) => <textarea className="textarea" {...props} />;

export default Field;
