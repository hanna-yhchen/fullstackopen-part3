export function Filter({ filter, setFilter }) {
  return (
    <label>
      Filter: <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </label>
  )
}
