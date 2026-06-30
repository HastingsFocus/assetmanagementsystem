/**
 * Button — consistent, accessible button built on the design-system classes.
 *
 * Props:
 *  - variant: "primary" | "secondary" | "danger" | "success" | "ghost"
 *  - size: "md" | "sm"
 *  - as: render as a different element (e.g. Link). Defaults to "button".
 */
const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  success: "btn-success",
  ghost: "btn-ghost",
};

const Button = ({
  variant = "primary",
  size = "md",
  as: Component = "button",
  className = "",
  type,
  children,
  ...rest
}) => {
  const classes = [
    "btn",
    VARIANTS[variant] || VARIANTS.primary,
    size === "sm" ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Only native buttons need a default type.
  const typeProp = Component === "button" ? { type: type || "button" } : {};

  return (
    <Component className={classes} {...typeProp} {...rest}>
      {children}
    </Component>
  );
};

export default Button;
