export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(event) => event.stopPropagation()}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="dialog-actions">
          <button type="button" className="button button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="button button-danger" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
