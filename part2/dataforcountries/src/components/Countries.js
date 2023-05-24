import React, { useState } from 'react';
import SingleCountryInfo from './SingleCountryInfo';

const Countries = ({singleCountry}) => {
  const [showCountry, setShowCountry] = useState(false)

  const handleShowClick= () => {
    setShowCountry(!showCountry)

  }
    return (
      <div>
      <table>
        <tr>
        {singleCountry.name.common} <button onClick={handleShowClick}>Show Info</button>
        </tr>
      </table>
        {showCountry && <SingleCountryInfo key={singleCountry.name.common} singleCountry={singleCountry} />}
      </div>
    )
   
  }

export default Countries;