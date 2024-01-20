import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const uri = `mongodb+srv://hanna:${password}@cluster0.veyvftz.mongodb.net/fullstackopen-phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

const Person = mongoose.model(
  'Person',
  new mongoose.Schema({
    name: String,
    number: String
  })
)

async function insertPerson() {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  await person.save()
  return person
}

try {
  await mongoose.connect(uri)
  if (process.argv.length === 5) {
    const person = await insertPerson()
    console.log(`added ${person.name} number ${person.number} to phonebook`)
  } else {
    const people = await Person.find({})
    console.log(people)
  }
} catch (error) {
  console.error(error.toString())
} finally {
  await mongoose.connection.close()
}
