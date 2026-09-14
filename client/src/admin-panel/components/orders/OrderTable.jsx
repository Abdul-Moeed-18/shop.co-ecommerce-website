export default function OrderTable({ orders = [] }) {
  return (
    <div className="table-panel">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.createdAt}</td>
              <td>{order.total}</td>
              <td>
                <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
              </td>
              <td>
                <button type="button" className="link-button">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
