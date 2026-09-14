import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { month: 'Jan', sales: 4200 },
  { month: 'Feb', sales: 4800 },
  { month: 'Mar', sales: 5300 },
  { month: 'Apr', sales: 6200 },
  { month: 'May', sales: 6900 },
  { month: 'Jun', sales: 7600 },
  { month: 'Jul', sales: 8400 },
  { month: 'Aug', sales: 8200 },
  { month: 'Sep', sales: 9100 },
]

export default function SalesChart() {
  return (
    <div className="panel chart-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">This year</p>
          <h3>Sales overview</h3>
        </div>
        <span className="panel-tag">+18.2%</span>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#5b7cff" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#5b7cff" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="sales" stroke="#5b7cff" strokeWidth={3} fill="url(#salesFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
