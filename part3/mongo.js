const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as an argument')
  process.exit(1)
}

const userPassword = process.argv[2]

const url = `mongodb+srv://abhay2412:${userPassword}@cluster1.441lb.mongodb.net/FullStackOpen2023Part3?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length===3){

  Person.find({}).then(result => {
    console.log('Phonebook: ')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to the phonebook`)
    mongoose.connection.close()
  })
}