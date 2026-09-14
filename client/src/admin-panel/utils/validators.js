export function validateProduct(values) {
  const errors = {}

  if (!values.name?.trim()) {
    errors.name = 'Product name is required.'
  }

  if (!values.category?.trim()) {
    errors.category = 'Category is required.'
  }

  if (!values.price || Number(values.price) <= 0) {
    errors.price = 'Price must be greater than zero.'
  }

  if (!values.stock || Number(values.stock) < 0) {
    errors.stock = 'Stock cannot be negative.'
  }

  return errors
}
