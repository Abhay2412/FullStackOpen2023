import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}


const getAll = async() => {
  const response = await axios.get(baseUrl)
  return response.data
}

const update = async(newObject) => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return response.data
}


const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const remove = async(id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const getId = () => (100000 * Math.random()).toFixed(0)

const getComment = async(id) => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  return response.data
}

const createComment = async(id, content) => {
  const newCommentToAdd = { content, id:getId() }
  const response = await axios.post(`${baseUrl}/${id}/comments`, newCommentToAdd)
  return response.data
}

export default { getAll, setToken, update, create, remove, getId, getComment, createComment }