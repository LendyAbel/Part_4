import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken =>{
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async newBlog => {
  const config = {headers: {Authorization: token}}
  const request = await axios.post(baseUrl, newBlog, config)
  return request.data
}

export default { getAll, createBlog, setToken }
