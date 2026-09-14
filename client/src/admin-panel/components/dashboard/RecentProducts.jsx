export default function RecentProducts({ products = [] }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h3>Popular products</h3>
        </div>
        <button type="button" className="text-button">Manage</button>
      </div>

      <div className="product-stack">
        {products.map((product) => (
          <div className="product-item" key={product.name}>
            <div className="product-thumb">{product.name.slice(0, 1)}</div>
            <div>
              <strong>{product.name}</strong>
              <span>{product.stock}</span>
            </div>
            <b>{product.price}</b>
          </div>
        ))}
      </div>
    </div>
  )
}
