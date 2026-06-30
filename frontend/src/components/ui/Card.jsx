/**
 * Card — a white rounded surface. Use `padded` (default) for standard
 * content spacing, or set padded={false} to control padding yourself
 * (e.g. when embedding a full-bleed table).
 */
const Card = ({ padded = true, className = "", children, ...rest }) => {
  return (
    <div className={`card ${className}`} {...rest}>
      {padded ? <div className="card-body">{children}</div> : children}
    </div>
  );
};

export default Card;
