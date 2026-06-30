/**
 * Table — wraps a standard <table> in a bordered, horizontally-scrollable
 * surface and applies the shared data-table styling. Pass <thead>/<tbody>
 * as children.
 */
const Table = ({ className = "", children }) => (
  <div className="table-wrap">
    <table className={`data-table ${className}`}>{children}</table>
  </div>
);

export default Table;
