export default function OrderDetails({ order }) {
  if (!order) return null

  return (
    <div className="order-detail-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Order</p>
            <h3>#{order.id}</h3>
          </div>
          <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
        </div>

        <div className="detail-list">
          <div><span>Customer</span><strong>{order.customer}</strong></div>
          <div><span>Email</span><strong>{order.email}</strong></div>
          <div><span>Address</span><strong>{order.address}</strong></div>
          <div><span>Payment</span><strong>{order.method}</strong></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Summary</p>
            <h3>Totals</h3>
          </div>
        </div>
        <div className="totals-box">
          <div><span>Subtotal</span><b>${(Number(order.total.replace(/[$,]/g, '')) / 1.1).toFixed(2)}</b></div>
          <div><span>Shipping</span><b>$12.00</b></div>
          <div><span>Tax</span><b>${(Number(order.total.replace(/[$,]/g, '')) * 0.1).toFixed(2)}</b></div>
          <div className="grand-total"><span>Total</span><b>{order.total}</b></div>
        </div>
      </div>
    </div>
  )
}
