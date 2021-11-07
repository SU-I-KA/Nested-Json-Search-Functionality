import React, { useState, useEffect } from 'react'
import axios from './axios'
import { Table, Form, Col, Container, Row, Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  // fetching all countries data using AXIOS
  const fetchData = async () => {
    try {
      const { data } = await axios.get('/v2/all')
      //console.log(data)
      setCountries(data)
    } catch (error) {
      console.log(error)
    }
  }

  // checking if it's an object
  const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  // only strings needed for compersion
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

  // search countries
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
    <Container className='mt-5'>
      <Form>
        <Form.Group>
          <Form.Control
            type='text'
            size='lg'
            // value={query}
            placeholder='Enter a search value....'
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Row className='mx-auto w-50 p-3'>
          <Col>
            <p className='text-muted'>Filter By Category : </p>
          </Col>
          <Col>
            <Row>
              {filterBy &&
                filterBy.map((item) => (
                  <Col key={item}>
                    <Form.Group>
                      <Form.Check
                        type='radio'
                        name='filterBy'
                        value={item}
                        checked={item === filter}
                        onChange={(e) => setFilter(e.target.value)}
                      />
                      <Form.Label className='text-capitalize'>
                        {item}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Form>
      {countries.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead className='text-center'>
            <tr>
              <th className='col-md-5'>Name</th>
              <th className='col-md-2'>Capital</th>
              <th className='col-md-2'>Region</th>
              <th className='col-md-3'>Flag</th>
            </tr>
          </thead>
          {search(countries).length > 0 ? (
            <tbody className='text-center'>
              {search(countries)?.map?.((country) => {
                const { name, capital, region, flag } = country
                return (
                  <tr key={name}>
                    <td className='align-middle'>{name}</td>
                    <td className='align-middle'>{capital}</td>
                    <td className='align-middle'>{region}</td>
                    <td className='align-middle'>
                      <img src={flag} alt={name} width='120px' />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td className='text-center col-md-12' colSpan='4'>
                  No Match
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      ) : (
        <div className='d-flex justify-content-center'>
          <Spinner animation='border' role='status'>
            <span className='sr-only'>Loading...</span>
          </Spinner>
        </div>
      )}
    </Container>
  )
}

export default App
