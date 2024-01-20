import { useState, useEffect } from 'react'
import * as personService from '@/services/persons'
import { PersonForm } from '@/components/PersonForm'
import { Filter } from '@/components/Filter'
import { Persons } from '@/components/Persons'
import { Message, MessageType } from '@/components/Message'

export function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchPersons = async () => {
      setPersons(await personService.getAll())
    }
    fetchPersons()
  }, [])

  const addPerson = async (event) => {
    event.preventDefault()

    const existingPerson = (persons.find(person => person.name === newName))
    if (existingPerson != null) {
      handleExistingPerson(existingPerson)
      return
    }

    const newPerson = await personService.create(newName, newNumber)
    setPersons(persons.concat(newPerson))
    clearInput()
    showMessage(`Added ${newPerson.name}`, MessageType.Success)
  }

  const handleExistingPerson = async (person) => {
    const shouldUpdate = confirm(
      `${person.name} is already added to phonebook. ` +
      'Do you want to replace the old number with a new one?'
    )
    if (!shouldUpdate) { return }
    person.number = newNumber
    try {
      const updatedPerson = await personService.update(person.id, person)
      setPersons(persons.map((person) =>
        person.id === updatedPerson.id ? updatedPerson : person)
      )
      clearInput()
      showMessage(`Updated ${updatedPerson.name}`, MessageType.Success)
    } catch (error) {
      console.log(error.message)
      showMessage(`Failed to update ${person.name}`, MessageType.ERROR)
    }
  }

  const clearInput = () => {
    setNewName('')
    setNewNumber('')
  }

  const handleDelete = async (id, name) => {
    const shouldDelete = confirm(`Do you want to delete ${name}?`)
    if (!shouldDelete) { return }
    try {
      await personService.remove(id)
      setPersons(persons.filter((person) => person.id !== id))
      showMessage(`Deleted ${name}`, MessageType.Success)
    } catch (error) {
      console.log(error.message)
      showMessage(`Failed to delete ${name}`, MessageType.ERROR)
    }
  }

  const showMessage = (content, messageType) => {
    setMessage({ content, messageType })
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message content={message?.content} messageType={message?.messageType} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <Persons persons={persons} filter={filter} onDelete={handleDelete} />
    </div>
  )
}
