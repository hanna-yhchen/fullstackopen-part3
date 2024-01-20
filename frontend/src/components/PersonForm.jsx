export function PersonForm({ addPerson, newName, setNewName, newNumber, setNewNumber }) {
  return (
    <form onSubmit={addPerson}>
      <label>
        Name:
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </label>
      <label>
        Number:
        <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
      </label>
      <button type='submit'>add</button>
    </form>
  )
}
