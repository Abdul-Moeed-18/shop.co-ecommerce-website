export default function StatCard({ label, value, change, tone = 'blue' }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className={`stat-badge tone-${tone}`}>{change}</span>
      </div>
      <h3>{value}</h3>
    </div>
  )
}
