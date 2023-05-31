import { useState, useEffect } from 'react';
import personService from "./services/persons";
import "./index.css";

const Button = (props) => {
  console.log(props)
  return (
    <button type={props.type} onClick={props.handleClick}>{props.text}</button>
    )
  }
  
  const Notification = ({ message }) => {
    if (message === null) {
    return null
  }
  return (
    <div className={message.type}>
      {message.text}
    </div>
  )
}

const Filter = ({textLabel, value, handleChange}) => {
  return (
    <div>
      {textLabel} <input value={value} onChange={handleChange} />
    </div>
  )
}

const PersonForm = ({onSubmitHandle, newName, newNumber, handleChangeName, handleChangeNumber }) => {
  return (
    <form onSubmit={onSubmitHandle}>
        <div>
          Name: <input value={newName} onChange={handleChangeName} />
        </div>
        <div>
          Phone Number: <input value={newNumber} onChange={handleChangeNumber} />
        </div>
        <div>
          <Button type="submit" text="Add"/>
        </div>
    </form>
  )
}

const Persons = ({searchResult}) => {
  return(
    <div>
      {searchResult}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  
  useEffect(() => {
    console.log('effect')
    personService
    .getAll()
    .then(response => {
      console.log("promise fulfilled")
      console.log(response)
      setPersons(response)
    })
    .catch(error => console.error(error))
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault();
    console.log("Button clicked", event.target);
    const newPerson = {
      name: newName,
      number: newNumber, 
    }
    const checkDuplicateName = persons.find(props => props.name.toLowerCase() === newPerson.name.toLowerCase())
    
    if(checkDuplicateName && checkDuplicateName.number === newPerson.number) {
      window.alert(`${newName} is already present in the phonebook`)
    }
    else if(checkDuplicateName && checkDuplicateName.number !== newPerson.number) {
      if(window.confirm(`${newName} is already present in the phonebook, would you like to replace the old phone number with a new one?`)) {
        const personToChange = {...checkDuplicateName, number:newNumber}
        personService
        .updatePerson(checkDuplicateName.id, personToChange) 
        .then(personToReturn => {
          setPersons(persons.map(n => n.id !== checkDuplicateName.id ? n : personToReturn))
          setNewName("")
          setNewNumber("")
          setNotificationMessage({
            text: `${checkDuplicateName.name}'s number was updated.`,
            type: "notification"
          })
          setTimeout(() => setNotificationMessage(null), 5000)      
        })
          .catch(error =>
            setPersons(persons
              .filter(person => 
                person.name !== checkDuplicateName.name
                )
                )
                )
                setNotificationMessage({
                  text: `${checkDuplicateName.name} has already been removed from the server`,
                  type: "error"
            })
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          }
        }
        else {
      personService
        .create(newPerson)
        .then(personToReturn => {
          setPersons(persons.concat(personToReturn))
          setNewName("")
          setNewNumber("")
        })
        .catch(error => {
          setNotificationMessage({
            text: `[ERROR] ${error.response.data.error}`,
            type: "error"
          })
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        setNotificationMessage({
          text: `${newPerson.name} successfully added to the phonebook.`,
          type: "notification"
        })
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      }
    }
    
  const deletePerson = (id) => {
    const personToDelete = persons.find(n => n.id === id)
    if(window.confirm(`Are you sure you want to delete ${personToDelete.name} ?`)) {
      personService
      .deletePerson(id)
      .then(personToReturn => {
        persons.map(personToDelete => personToDelete.id !== id ? personToDelete : personToReturn)
      })
      setPersons(persons.filter(persons => persons.id !== id))
      setNotificationMessage({
        text: `${personToDelete.name} was successfully deleted from the phonebook.`,
        type: "notification"
      })
      setTimeout(() => {
        setNotificationMessage(null)
        }, 5000)
      }
    } 
    
    const handleNameAddition = (event) => {
      console.log(event.target.value);
      setNewName(event.target.value);
    }
    
    const handlePhoneNumberAddition = (event) => {
      console.log(event.target.value);
    setNewNumber(event.target.value);
  }
  
  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchName(event.target.value);
  }
  const searched = searchName === "" ? persons : persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))
  
  const SinglePerson = ({name, number, id}) => {
    return (
      <p key={id}> {name} {number} <Button type="submit" text="Delete Person" handleClick={() => deletePerson(id)}/> </p>
    )
  }
  
  const searchResult = searched.map(props => <SinglePerson key={props.id} name={props.name} number={props.number} id={props.id}/>)

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} />

      <Filter textLabel="Search for a Name:" value={searchName} handleChange={handleSearch}/>
      
      <h3>Add A New Person</h3>
      
      <PersonForm onSubmitHandle={addPerson} newName={newName} newNumber={newNumber} handleChangeName={handleNameAddition} handleChangeNumber={handlePhoneNumberAddition} />

      <h3>Numbers</h3>
      
      <Persons searchResult={searchResult}/>
    
    </div>
  )
}

export default App;