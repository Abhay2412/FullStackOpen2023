import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
    .then(res => {
      console.log('The response data: ', res[0])
      setCountry(res)
    })
    .catch(error => {
      setCountry(null)
    })
  }, [name])
  console.log('Country: ', country)

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return (
      <div>
        Not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data[0].name.common} </h3>
      <div>Capital City: {country.data[0].capital} </div>
      <div>Population: {country.data[0].population}</div> 
      <img src={country.data[0].flags.png} height='100' alt={`flag of ${country.data[0].flags.alt}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} /> <button>Find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App