import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://restcountries.com',
})

export default instance
