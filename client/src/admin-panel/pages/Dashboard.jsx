import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const salesData = [
  { name: "Jan", sales: 4200 },
  { name: "Feb", sales: 5800 },
  { name: "Mar", sales: 4900 },
  { name: "Apr", sales: 7200 },
  { name: "May", sales: 6800 },
  { name: "Jun", sales: 8500 },
  { name: "Jul", sales: 9200 },
];

const stats = [
  {
    title: "Total Products",
    value: "125",
    change: "+12.5%",
    icon: Package,
  },
  {
    title: "Total Orders",
    value: "1,248",
    change: "+8.2%",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: "856",
    change: "+5.7%",
    icon: Users,
  },
  {
    title: "Total Revenue",
    value: "$24,580",
    change: "+14.8%",
    icon: DollarSign,
  },
];

const orders = [
  {
    id: "#ORD-1001",
    customer: "Ali Khan",
    amount: "$120",
    status: "Delivered",
  },
  {
    id: "#ORD-1002",
    customer: "Ahmed Raza",
    amount: "$85",
    status: "Processing",
  },
  {
    id: "#ORD-1003",
    customer: "Hassan Ali",
    amount: "$210",
    status: "Shipped",
  },
  {
    id: "#ORD-1004",
    customer: "Usman Malik",
    amount: "$65",
    status: "Pending",
  },
];

function statusClass(status) {
  const classes = {
    Delivered: "bg-green-100 text-green-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Pending: "bg-slate-100 text-slate-700",
  };

  return classes[status] || classes.Pending;
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon size={23} className="text-slate-700" />
                </div>

                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <TrendingUp size={14} />
                  {stat.change}
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-5">
                {stat.title}
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Sales Overview
            </h2>
            <p className="text-sm text-slate-500">
              Monthly sales performance
            </p>
          </div>

          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
            <option>Last 7 Months</option>
            <option>Last 12 Months</option>
          </select>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="currentColor"
                fill="currentColor"
                fillOpacity={0.08}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold text-lg text-slate-900">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-4 font-semibold">
                  Order
                </th>
                <th className="text-left px-5 py-4 font-semibold">
                  Customer
                </th>
                <th className="text-left px-5 py-4 font-semibold">
                  Amount
                </th>
                <th className="text-left px-5 py-4 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-100"
                >
                  <td className="px-5 py-4 font-semibold">
                    {order.id}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {order.customer}
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {order.amount}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}