import { useEffect, useState } from 'react';
import axios from 'axios';
import FilterChoice from './components/FilterChoice';

const App = () => {
  const[country, setCountry] = useState('')
  const[allCountries, setAllCountries] = useState([])
 
  useEffect(() => {
      axios
        .get('https://restcountries.com/v3.1/all')
        .then(response => {
          setAllCountries(response.data)
        })
  }, [])
  

  const handleCountryChange = (event) => {
    setCountry(event.target.value)
  }

  
  return (
    <div>
      <form>
        Find countries <input value={country} onChange={handleCountryChange} />
      </form>
      <div>
        <FilterChoice key={allCountries.id} countries={allCountries} country={country} />
      </div>
    </div>
  )
}

export default App;
