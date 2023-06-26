import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { getAnecdotes, updateVotes } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()

  const dispatch = useNotificationDispatch()

  const updateVoteMutation = useMutation(updateVotes, {
    onSuccess: (updatedAnecdote) => {
      console.log('Updating the votes', updatedAnecdote)

      const anecdotes = queryClient.getQueryData('anecdotes')

      queryClient.setQueryData('anecdotes', anecdotes.map(anecdote => 

        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote

      )) 
    }
  })

  const handleVote = async (anecdote) => {
    updateVoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    await dispatch({ type: 'showNotification', payload: `You have voted for the following anecdote: ${anecdote.content}` })
    setTimeout(() => {
      dispatch({ type: 'hideNotification' })
    }, 5000)
    console.log('vote')
  }

  const result = useQuery('anecdotes', getAnecdotes, { retry: 1, refetchOnWindowFocus: false })
  console.log(result)

  if (result.isLoading) {
    return <div>The data is being loaded...</div>
  }
  if (result.isError) {
    return <div>There was a problem in retrieving data from the server</div>
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
            has this many votes {anecdote.votes} <button onClick={() => handleVote(anecdote)}>Vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App