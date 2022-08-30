import { useEffect, useState } from 'react'
import axios from 'axios'

const api_key = process.env.REACT_APP_API_KEY //https://openweathermap.org/

const CountryFilter = ({ filter, handleFilter }) => {
  return (
    <div>
      find countries <input value={filter} onChange={handleFilter} />
    </div>
  )
}

const Country = ({ country }) => {
  const name = country.name.common
  const capital = country?.capital?.length ? country.capital[0] : 'undefined'
  // if capital property not found eg. Heard Island and McDonald Islands -> show undefined
  const area = country.area
  const languages = Object.values(country.languages)
  const flagURL = country.flags.png

  return (
    <div>
      <h2>{name}</h2>
      <p>capital {capital}</p>
      <p>area {area}</p>
      <h3>languages:</h3>
      <ul>
        {languages.map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={flagURL} width="150px" alt={`${name}'s flag`}></img>
      <Weather capital={capital} />
    </div>
  )
}

const Countries = ({ countries, handleSingleCountry }) => {
  return (
    countries.map(country =>
      <div key={country.name.common}>
        {country.name.common} <button onClick={() => handleSingleCountry(country)}>show</button>
      </div>)
  )
}

const Results = ({ filteredCountries, handleSingleCountry, singleCountry }) => {
  const results = () => {
    if (filteredCountries.length > 10) {
      return 'Too many matches, specify another filter'
    } else if (singleCountry !== '') {
      return <Country country={singleCountry} />
    } else if (filteredCountries.length === 1) {
      return <Country country={filteredCountries[0]} />
    } else {
      return <Countries countries={filteredCountries} handleSingleCountry={handleSingleCountry} />
    }
  }

  return (
    <div>
      {results()}
    </div>
  )
}

const Weather = ({ capital }) => {
  const [temperature, setTemperature] = useState(0)
  const [icon, setIcon] = useState('01d')
  const [windspeed, setWindspeed] = useState(0)

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${api_key}`)
      .then(response => {
        setTemperature(response.data.main.temp - 273.15)
        setWindspeed(response.data.wind.speed)
        setIcon(response.data.weather[0].icon)       
      })
  }, [])

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {temperature.toFixed(2)} Celsius</p>
      <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`}></img>
      <p>wind {windspeed} m/s</p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [singleCountry, setSingleCountry] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilter = (event) => {
    setSingleCountry('')
    setFilter(event.target.value)
  }

  const filterCountries = () => countries.filter(
    country => country.name.common
      .toLowerCase()
      .includes(filter.toLowerCase()))

  const handleSingleCountry = (selectedCountry) => {
    setSingleCountry(selectedCountry)
  }

  return (
    <div>
      <CountryFilter
        filter={filter}
        handleFilter={handleFilter}
      />
      <Results
        filteredCountries={filterCountries()}
        handleSingleCountry={handleSingleCountry}
        singleCountry={singleCountry}
      />
    </div>

  )
}

export default App;
