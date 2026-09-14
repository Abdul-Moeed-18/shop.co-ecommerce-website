export default function RecentOrders({ orders = [] }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Latest</p>
          <h3>Recent orders</h3>
        </div>
        <button type="button" className="text-button">View all</button>
      </div>

      <div className="table-list">
        {orders.map((order) => (
          <div className="list-row" key={order.id}>
            <div>
              <strong>{order.id}</strong>
              <span>{order.customer}</span>
            </div>
            <div>
              <span>{order.date}</span>
            </div>
            <div>
              <strong>{order.total}</strong>
            </div>
            <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
