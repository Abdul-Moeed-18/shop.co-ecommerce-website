export default function UserTable({ users = [] }) {
  return (
    <div className="table-panel">
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Email</th>
            <th>Orders</th>
            <th>Total spent</th>
            <th>Tier</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.orders}</td>
              <td>{user.spend}</td>
              <td>
                <span className={`status-pill ${user.tier.toLowerCase()}`}>{user.tier}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
