import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

export const setToken = newToken => {
  token = `Bearer ${newToken}`
}


export const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export const updateLikes = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  return response.data
}


export const createNewBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export const deleteBlog = async (blogToBeDeleted) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blogToBeDeleted.id}`, config)
  return response.data
}

export const login = async (credentials) => {
  const response = await axios.post('/api/login', credentials)
  return response.data
}