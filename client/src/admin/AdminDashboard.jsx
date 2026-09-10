export default function AdminDashboard() {
  const stats = [
    { title: "Total Products", value: "0" },
    { title: "Total Orders", value: "0" },
    { title: "Total Users", value: "0" },
    { title: "Total Sales", value: "$0" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to your SHOP.CO admin dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <p className="text-gray-500 text-sm">{stat.title}</p>
            <h2 className="text-3xl font-bold mt-3">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6 mt-8">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <p className="text-gray-500 mt-2">
          Orders will appear here after MongoDB integration.
        </p>
      </div>
    </div>
  );
}