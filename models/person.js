import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

const uri = process.env.MONGODB_URI

try {
  console.log(`connecting to ${uri}`)
  await mongoose.connect(uri)
  console.log('connected to MongoDB')
} catch (error) {
  console.error('failed to connect to MongoDB:', error.message)
}

export const Person = mongoose.model(
  'Person',
  new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      require: true
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: (value) => /\d{2,3}-\d+/.test(value),
        message: (props) => `${props.value} is not a valid phone number!`
      },
      require: true
    }
  }, {
    toJSON: {
      transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    }
  })
)
