import { useState, useEffect } from 'react';
import axios from "axios";

const Filter = ({textLabel, value, handleChange}) => {
  return (
    <div>
      {textLabel} <input value={value} onChange={handleChange} />
    </div>
  )
}

const PersonForm = ({onSubmitHandle, newName, newPhoneNumber, handleChangeName, handleChangeNumber }) => {
  return (
    <form onSubmit={onSubmitHandle}>
        <div>
          Name: <input value={newName} onChange={handleChangeName} />
        </div>
        <div>
          Phone Number: <input value={newPhoneNumber} onChange={handleChangeNumber} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
    </form>
  )
}

const Persons = ({searchResult}) => {
  return(
    <div >
      {searchResult}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        console.log("promise fulfilled")
        console.log(response.data)
        setPersons(response.data)
      })
  }, [])
  console.log("render", persons.length, "persons")

  const addPerson = (event) => {
    event.preventDefault();
    console.log("Button clicked", event.target);
    const newPerson = {
      name: newName,
      phoneNumber: newPhoneNumber, 
    }
    const checkDuplicateName = persons.find(props => props.name.toLowerCase() === newPerson.name.toLowerCase())
    if(checkDuplicateName) {
      window.alert(`${newName} is already present in the phonebook`)
    }
    else {
      setPersons(persons.concat(newPerson));
    }
    setNewName("");
    setNewPhoneNumber("");
  }

  const handleNameAddition = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  const handlePhoneNumberAddition = (event) => {
    console.log(event.target.value);
    setNewPhoneNumber(event.target.value);
  }

  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchName(event.target.value);
  }
  const searched = persons.map(props => props.name.toLowerCase().includes(searchName.toLowerCase())) ?
  persons.filter(props => props.name.toLowerCase().includes(searchName.toLowerCase())): persons

  const searchResult = searched.map((person) => <p>{person.name} {person.phoneNumber}</p>)
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter textLabel="Search for a Name:" value={searchName} handleChange={handleSearch}/>
      
      <h3>Add A New Person</h3>
      
      <PersonForm onSubmitHandle={addPerson} newName={newName} newPhoneNumber={newPhoneNumber} handleChangeName={handleNameAddition} handleChangeNumber={handlePhoneNumberAddition} />

      <h3>Numbers</h3>
      
      <Persons searchResult={searchResult} />
    
    </div>
  )
}

export default App;
