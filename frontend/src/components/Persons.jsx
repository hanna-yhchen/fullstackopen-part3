export function Persons({ persons, filter, onDelete }) {
  return (
    <table>
      <tbody>
        {persons
          .filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
          )
          .map(({ name, number, id }) =>
            <tr key={id}>
              <td>{name}</td>
              <td>{number}</td>
              <td>
                <button onClick={() => onDelete(id, name)}>Delete</button>
              </td>
            </tr>
          )}
      </tbody>
    </table>
  )
}
