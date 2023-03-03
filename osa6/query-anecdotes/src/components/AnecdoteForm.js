import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext'
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {
    const notificationDispatch = useNotificationDispatch()
    const queryClient = useQueryClient()
    const newAnecdoteMutation = useMutation(
        createAnecdote,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('anecdotes')
            },
            onError: () => {
                const message = `Anecdote is too short, must have at least 5 characters.`
                notificationDispatch({ type: "SET", payload: message })
                setTimeout(() => {
                    notificationDispatch({ type: "REMOVE" })
                }, 5000)
            }
        }
    )

    const onCreate = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        newAnecdoteMutation.mutate({
            content,
            votes: 0
        })
        const message = `Anecdote ${content} created!`
        notificationDispatch({ type: "SET", payload: message })
        setTimeout(() => {
            notificationDispatch({ type: "REMOVE" })
        }, 5000)
    }

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={onCreate}>
                <input name='anecdote' />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm