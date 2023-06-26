import { useQueryClient, useMutation } from 'react-query'
import { createNewAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation(createNewAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    }, 
    onError: () => {
      dispatch({ type: 'showNotification', payload: `The anecdote is too short, must have length 5 or more characters!` })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    }
  })

  const getId = () => (100000 * Math.random()).toFixed(0)

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, id: getId(), votes: 0 })
    await dispatch({ type: 'showNotification', payload: `You have added the following anecdote: ${content}` })
    setTimeout(() => {
      dispatch({ type: 'hideNotification' })
    }, 5000)
    console.log('new anecdote')
}

  return (
    <div>
      <h3>Create New Anecdote</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' /> <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm