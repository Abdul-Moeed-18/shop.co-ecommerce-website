export const navItems = [
  { label: 'Dashboard', path: '/', icon: '▣' },
  { label: 'Products', path: '/products', icon: '◫' },
  { label: 'Categories', path: '/categories', icon: '◧' },
  { label: 'Orders', path: '/orders', icon: '◬' },
  { label: 'Customers', path: '/customers', icon: '◍' },
  { label: 'Analytics', path: '/analytics', icon: '◭' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
]

export const dashboardStats = [
  { label: 'Total Revenue', value: '$128.4K', change: '+12.4%', tone: 'emerald' },
  { label: 'Orders', value: '2,430', change: '+8.2%', tone: 'blue' },
  { label: 'Conversion', value: '4.82%', change: '+1.6%', tone: 'violet' },
  { label: 'Returning Customers', value: '68%', change: '+4.7%', tone: 'amber' },
]

export const monthlySales = [
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

export const recentOrders = [
  { id: '#1042', customer: 'Ava Patel', total: '$245.00', status: 'Paid', date: 'Today, 11:40 AM' },
  { id: '#1041', customer: 'Oliver Kim', total: '$182.30', status: 'Packed', date: 'Today, 10:05 AM' },
  { id: '#1040', customer: 'Sofia Chen', total: '$399.99', status: 'Shipped', date: 'Today, 9:15 AM' },
  { id: '#1039', customer: 'Liam Brown', total: '$142.50', status: 'Pending', date: 'Yesterday' },
]

export const recentProducts = [
  { name: 'Classic Leather Tote', price: '$89', stock: '18 left' },
  { name: 'Minimal Smart Watch', price: '$129', stock: '27 left' },
  { name: 'Urban Runner Sneaker', price: '$119', stock: '12 left' },
  { name: 'Luna Glass Bottle', price: '$38', stock: '42 left' },
]

export const products = [
  { id: 1, name: 'Classic Leather Tote', category: 'Accessories', price: 89, stock: 18, status: 'Active' },
  { id: 2, name: 'Minimal Smart Watch', category: 'Electronics', price: 129, stock: 27, status: 'Featured' },
  { id: 3, name: 'Urban Runner Sneaker', category: 'Footwear', price: 119, stock: 12, status: 'Draft' },
  { id: 4, name: 'Luna Glass Bottle', category: 'Home', price: 38, stock: 42, status: 'Active' },
  { id: 5, name: 'Coastal Knit Set', category: 'Apparel', price: 94, stock: 9, status: 'Low Stock' },
  { id: 6, name: 'Breeze Speaker', category: 'Electronics', price: 149, stock: 21, status: 'Active' },
]

export const categories = [
  { id: 1, name: 'Apparel', products: 124, description: 'Everyday essentials and seasonal wear.' },
  { id: 2, name: 'Accessories', products: 86, description: 'Bags, jewelry, and premium add-ons.' },
  { id: 3, name: 'Electronics', products: 42, description: 'Smart devices and connected gadgets.' },
  { id: 4, name: 'Home', products: 58, description: 'Decor, storage, and wellness essentials.' },
]

export const customers = [
  { id: 1, name: 'Ava Patel', email: 'ava@shopco.io', orders: 12, spend: '$2,430', tier: 'VIP' },
  { id: 2, name: 'Oliver Kim', email: 'oliver@shopco.io', orders: 9, spend: '$1,860', tier: 'Gold' },
  { id: 3, name: 'Sofia Chen', email: 'sofia@shopco.io', orders: 14, spend: '$3,110', tier: 'VIP' },
  { id: 4, name: 'Liam Brown', email: 'liam@shopco.io', orders: 5, spend: '$890', tier: 'Silver' },
]

export const orderDetails = [
  {
    id: '1001',
    customer: 'Ava Patel',
    email: 'ava@shopco.io',
    status: 'Paid',
    total: '$245.00',
    items: 2,
    method: 'Visa ••• 2048',
    address: '28 Harbor Avenue, Seattle, WA',
    createdAt: '2026-09-13',
  },
  {
    id: '1002',
    customer: 'Oliver Kim',
    email: 'oliver@shopco.io',
    status: 'Packed',
    total: '$182.30',
    items: 1,
    method: 'Mastercard ••• 5104',
    address: '42 Maple Street, Austin, TX',
    createdAt: '2026-09-12',
  },
  {
    id: '1003',
    customer: 'Sofia Chen',
    email: 'sofia@shopco.io',
    status: 'Shipped',
    total: '$399.99',
    items: 3,
    method: 'Amex ••• 8890',
    address: '15 Cedar Lane, Chicago, IL',
    createdAt: '2026-09-11',
  },
]
