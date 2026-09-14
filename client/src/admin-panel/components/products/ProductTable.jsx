export default function ProductTable({ products = [] }) {
  return (
    <div className="table-panel">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-cell">
                  <div className="mini-thumb">{product.name.slice(0, 1)}</div>
                  <span>{product.name}</span>
                </div>
              </td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <span className={`status-pill ${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {product.status}
                </span>
              </td>
              <td>
                <div className="inline-actions">
                  <button type="button" className="link-button">Edit</button>
                  <button type="button" className="link-button danger">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
