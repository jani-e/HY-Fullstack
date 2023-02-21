import { useSelector, useDispatch } from 'react-redux'
import { incrementVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

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
        dispatch(incrementVote(anecdote))
        dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
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