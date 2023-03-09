import axios from 'axios'
const url = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(url, newBlog, config)
  return response.data
}

const update = async (id, newBlog) => {
  const response = await axios.put(`${url}/${id}`, newBlog)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${url}/${id}`, config)
  return response.data
}

const addComment = async (id, comment) => {
  const response = await axios.post(`${url}/${id}/comments`, comment)
  return response.data
}

const blogService = {
  getAll,
  setToken,
  create,
  update,
  remove,
  addComment
}

export default blogService
