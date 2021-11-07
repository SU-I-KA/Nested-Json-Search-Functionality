import React, { useState, useEffect } from 'react'
import axios from './axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchData = async () => {
    try {
      const { data } = await axios.get('/v2/all')
      //console.log(data)
      setCountries(data)
    } catch (error) {
      console.log(error)
    }
  }

  const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  const isString = (item) => {
    let status = false
    const recursive = (val) => {
      if (Array.isArray(val)) {
        //console.log(val)
        val?.map?.((str) => recursive(str))
      }
      if (isObject(val)) {
        for (const key in val) {
          let value = val[key]
          //console.log(value)
          recursive(value)
        }
      }
      if (val?.toString()?.toLowerCase()?.includes(query.toLowerCase())) {
        status = true
        return
      }
    }
    recursive(item)
    return status
  }

  const search = (rows) => {
    let columns = null
    if (filter === 'all') {
      columns = rows?.[0] && Object.keys(rows[0])
    } else {
      columns = ['capital']
    }
    //console.log(columns)
    return rows?.filter((row) =>
      columns?.some?.((column) => isString(row[column]))
    )
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filterBy = ['all', 'capital']
  return (
    <div className='container'>
      <input
        type='text'
        // value={query}
        placeholder='Enter a search value....'
        onChange={(e) => setQuery(e.target.value)}
      />
      filter by:{' '}
      {filterBy &&
        filterBy.map((item) => (
          <div key={item}>
            <input
              type='radio'
              name='filterBy'
              value={item}
              checked={item === filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label>{item}</label>
          </div>
        ))}
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
          {search(countries)?.map?.((country) => {
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
