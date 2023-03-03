import axios from 'axios'

const url = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
    axios
        .get(url)
        .then(response => response.data)

export const createAnecdote = (anecdote) => 
    axios
        .post(url, anecdote)
        .then(response => response.data)

export const updateAnecdote = (anecdote) => 
    axios
        .put(`${url}/${anecdote.id}`, anecdote)
        .then(response => response.data)