import { useSelector, useDispatch } from "react-redux"
import { addVotes } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if(state.filters === null) {
            return state.anecdotes.sort((a, b) => b.votes - a.votes )
        }
        return state.anecdotes.filter((anecdote) => 
            anecdote.content.toLowerCase().includes(state.filters.toLowerCase())).sort((a, b) => b.votes - a.votes)
    })
    const dispatch = useDispatch()

    const vote = (id, content) => {
        console.log('vote', id, content)
        dispatch(addVotes(id))
        dispatch(setNotification(`You voted for the following anecdote "${content}"`, 5))
    }
    return (
        <div>
          {anecdotes.map(anecdote =>
            <div key={anecdote.id}>
              <div>
                {anecdote.content}
              </div>
              <div>
                has this many {anecdote.votes} votes <button onClick={() => vote(anecdote.id, anecdote.content)}>Vote</button>
              </div>
            </div>
          )}
        </div>
      )
}

export default AnecdoteList