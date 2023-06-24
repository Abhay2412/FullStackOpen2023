/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getId = () => (100000 * Math.random()).toFixed(0)

const createNewAnecdote = async (content) => {
    const newAnecdote = {
        content,
        id: getId(),
        votes: 0
    }
    const response = await axios.post(baseUrl, newAnecdote)
    return response.data
}

const updateVotes = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    const anecdoteToUpdate = response.data
    const updatedAnecdote = { ...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1 }
    const request = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
    return request.then(response => response.data)
}

export default { getAll, createNewAnecdote, updateVotes }