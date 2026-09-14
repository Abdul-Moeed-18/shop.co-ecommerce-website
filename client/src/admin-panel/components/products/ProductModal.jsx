import Modal from '../common/Modal'
import ProductForm from './ProductForm'

export default function ProductModal({ open, onClose }) {
  return (
    <Modal open={open} title="Add product" onClose={onClose}>
      <ProductForm />
    </Modal>
  )
}
