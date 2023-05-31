const mongoose = require('mongoose')

require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
console.log('Connecting to this URL:', url)
mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{7,}/.test(v);
      },
      message: props => `${props.value} is not valid phone number!`
    },
    minLength: 8,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})


module.exports = mongoose.model('Person', personSchema)