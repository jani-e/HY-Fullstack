import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
    const notificationDispatch = useNotificationDispatch()
    const queryClient = useQueryClient()
    const updateAnecdoteMutation = useMutation(updateAnecdote, {
        onSuccess: () => {
            queryClient.invalidateQueries('anecdotes')
        }
    })

    const handleVote = (anecdote) => {
        updateAnecdoteMutation.mutate({
            ...anecdote,
            votes: anecdote.votes + 1
        })
        const message = `Anecdote '${anecdote.content}' voted!`
        notificationDispatch({ type: "SET", payload: message })
        setTimeout(() => {
            notificationDispatch({ type: "REMOVE" })
        }, 5000)
    }

    const result = useQuery(
        'anecdotes',
        getAnecdotes,
        { retry: false }
    )

    if (result.isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (result.isError) {
        return (
            <div>
                Service is not available due to {result.error.message}.
            </div>
        )
    }

    const anecdotes = result.data

    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification />
            <AnecdoteForm />

            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App