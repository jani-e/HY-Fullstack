import { useSelector, useDispatch } from 'react-redux'
import { incrementVote } from '../reducers/anecdoteReducer'
import { clearNotification, showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        return anecdotes
            .filter(anecdote =>
                anecdote
                    .content.toLowerCase()
                    .includes(filter.toLowerCase()))
            .sort((a, b) => b.votes - a.votes)
    })
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(incrementVote(anecdote.id))
        dispatch(showNotification(`you voted '${anecdote.content}'`))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
    }

    return (
        <div>
            {anecdotes
                .map(anecdote =>
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => vote(anecdote)}>vote</button>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default AnecdoteList