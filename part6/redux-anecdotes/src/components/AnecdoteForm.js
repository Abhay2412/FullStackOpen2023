import { useDispatch } from "react-redux"
import { createNewAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addNewAnecdote = async (event) => {
        event.preventDefault()
        console.log(event.target)
        const content = event.target.anecdotesInput.value
        event.target.anecdotesInput.value = ''
        dispatch(createNewAnecdote(content))
        dispatch(setNotification(`You added the following anecdote "${content}"`, 5))
    }

    return (
        <div>
            <h2>Create New</h2>
            <form onSubmit={addNewAnecdote}>
                <div><input name='anecdotesInput'/> <button type='submit'>Create</button> </div>
            </form>
        </div>
    )
}

export default AnecdoteForm