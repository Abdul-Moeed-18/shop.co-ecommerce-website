export default function OrderStatus({ status }) {
  return <span className={`status-pill ${status.toLowerCase()}`}>{status}</span>
}
