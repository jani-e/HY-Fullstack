import axios from 'axios'
const url = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token}
  }
  const response = await axios.post(url, newBlog, config)
  return response.data
}

const blogService = {
  getAll, 
  setToken,
  create
}

export default blogService