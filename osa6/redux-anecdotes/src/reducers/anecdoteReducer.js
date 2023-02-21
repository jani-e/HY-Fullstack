import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from './../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        updateAnecdote(state, action) {
            const changedAnecdote = action.payload
            return state.map(anecdote => anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote)
        },
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = (content) => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.create(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const incrementVote = (content) => {
    return async dispatch => {
        const changedAnecdote = {
            ...content,
            votes: content.votes + 1
        }
        const updatedAnecdote = await anecdoteService.update(changedAnecdote)
        dispatch(updateAnecdote(updatedAnecdote))
    }
}

export default anecdoteSlice.reducer