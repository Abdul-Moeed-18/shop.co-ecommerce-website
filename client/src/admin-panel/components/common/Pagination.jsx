export default function Pagination() {
  return (
    <div className="pagination">
      <button type="button" className="page-btn">Prev</button>
      <div className="page-indicator">
        <span className="active">1</span>
        <span>2</span>
        <span>3</span>
      </div>
      <button type="button" className="page-btn">Next</button>
    </div>
  )
}
