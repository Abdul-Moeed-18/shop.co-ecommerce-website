import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '../api/apiClient'
import OrderDetailsComponent from '../components/orders/OrderDetails'
import Loader from '../components/common/Loader'

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const load = async () => {
      const data = await apiClient.getOrderById(id)
      setOrder(data)
    }

    load()
  }, [id])

  if (!order) {
    return <Loader />
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Sales</p>
          <h1>Order details</h1>
        </div>
      </div>

      <OrderDetailsComponent order={order} />
    </div>
  )
}
