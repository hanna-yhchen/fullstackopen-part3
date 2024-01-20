import axios from 'axios'

const baseUrl = '/api/persons'

export async function getAll() {
  const response = await axios.get(baseUrl)
  return response.data
}

export async function create(name, number) {
  const response = await axios.post(baseUrl, { name, number })
  return response.data
}

export async function update(id, person) {
  const response = await axios.put(`${baseUrl}/${id}`, person)
  return response.data
}

export async function remove(id) {
  await axios.delete(`${baseUrl}/${id}`)
}
