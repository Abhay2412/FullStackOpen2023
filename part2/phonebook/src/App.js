import { useState, useEffect } from 'react';
import axios from "axios";
import personService from "./services/persons";

const Button = (props) => {
  console.log(props)
  return (
      <button type={props.type} onClick={props.handleClick}>{props.text}</button>
  )
}

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
          <Button type="submit" text="Add"/>
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
    personService
      .getAll()
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
    const personToChange = {...checkDuplicateName, phoneNumber:newPhoneNumber}

    if(checkDuplicateName && checkDuplicateName.phoneNumber === newPerson.phoneNumber) {
      window.alert(`${newName} is already present in the phonebook`)
    }
    else if(checkDuplicateName && checkDuplicateName.phoneNumber !== newPerson.phoneNumber) {
      if(window.confirm(`${newName} is already present in the phonebook, would you like to replace the old phone number with a new one?`)) {
        personService
          .updatePerson(checkDuplicateName.id, personToChange) 
          .then(personToReturn => {
            setPersons(persons.map(n => n.id !== checkDuplicateName.id ? n : personToReturn))
            setNewName("")
            setNewPhoneNumber("")
          })
      }
    }
    else {
      personService
        .create(newPerson)
        .then(personToReturn => {
          setPersons(persons.concat(personToReturn))
          setNewName("")
          setNewPhoneNumber("")
        })
    }
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(n => n.id === id)
    if(window.confirm(`Are you sure you want to delete ${personToDelete.name} ?`)) {
      personService
        .deletePerson(id)
        setPersons(persons.filter(persons => persons.id !== id))
    }
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

  const SinglePerson = ({name, phoneNumber, id}) => {
    return (
      <p>{name} {phoneNumber} <Button type="submit" text="Delete Person" handleClick={() => deletePerson(id)}/> </p>
    )
  }

  const searchResult = searched.map(props => <SinglePerson key={props.id} name={props.name} phoneNumber={props.phoneNumber} id={props.id} />)
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