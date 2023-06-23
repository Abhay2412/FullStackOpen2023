import { useDispatch } from "react-redux"
import { createNewAnecdote } from "../reducers/anecdoteReducer"
import { handleNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addNewAnecdote = (event) => {
        event.preventDefault()
        console.log(event.target)
        const content = event.target.anecdotesInput.value
        event.target.anecdotesInput.value = ''
        dispatch(createNewAnecdote(content))
        dispatch(handleNotification(`You added the following anecdote "${content}"`))
        setTimeout(() => {
            dispatch(handleNotification(''))
        }, 5000)
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