import React, { useState, useEffect } from 'react'
import axios from './axios'

const App = () => {
  const [countries, setCountries] = useState([])

  const fetchData = async () => {
    try {
      const { data } = await axios.get('/v2/all')
      //console.log(data)
      setCountries(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='container'>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capital</th>
            <th>Region</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {countries?.map?.((country) => {
            const { name, capital, region, flag } = country
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{capital}</td>
                <td>{region}</td>
                <td>
                  <img src={flag} alt={name} width='120px' />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default App
