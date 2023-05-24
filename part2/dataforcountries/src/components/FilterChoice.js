import Countries from './Countries';
import SingleCountryInfo from './SingleCountryInfo';

const FilterChoice = ({country, countries}) => {
    let filteredChoice = []

    if(country.length > 0) {
        filteredChoice = countries.filter(singleCountry => singleCountry.name.common.toLowerCase().includes(country.toLowerCase()))
    } 
    else {
        filteredChoice = countries
    }

    if(filteredChoice.length > 10 ) {
      return ("Too many matches, specify another filter")
    }
    else if (filteredChoice.length === 1) {
      return (filteredChoice.map(singleCountry => <SingleCountryInfo key={singleCountry.name.common} singleCountry={singleCountry}/>))
    }
    else {
      return (filteredChoice.map(singleCountry => <Countries key={singleCountry.name.common} singleCountry={singleCountry} />))
    } 
  }

export default FilterChoice;