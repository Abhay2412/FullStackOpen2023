import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherDisplay from './WeatherDisplay';

const OneCountryDisplay = ({singleCountry}) => {
    const keys = Object.keys(singleCountry.languages)
    const[weatherInfo, setWeatherInfo] = useState([])
    
    useEffect(() => {
        const apiKeyOpenWeather = process.env.REACT_APP_API_KEY
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?q=${singleCountry.capital[0]}&appid=${apiKeyOpenWeather}`)
          .then(response => {
            console.log(response.data)
            console.log(weatherInfo)
            setWeatherInfo(response.data)
          })
    },[weatherInfo, singleCountry]) 

    return(
      <div>
        <div>
            <h1>{singleCountry.name.common}</h1>
            <p>The capital of {singleCountry.name.common} is {singleCountry.capital[0]}</p>
            <p>The population of {singleCountry.name.common} is {singleCountry.population}</p>
            <h3>Languages:</h3>
            <ul>
                {keys.map(keys => <li>{singleCountry.languages[keys]}</li>)}
            </ul>
            <img src={singleCountry.flags.png} alt='flag' height='10%' width='10%' /> 
        </div>
        <WeatherDisplay singleCountry={singleCountry}/>
      </div>
    )
  }

  export default OneCountryDisplay