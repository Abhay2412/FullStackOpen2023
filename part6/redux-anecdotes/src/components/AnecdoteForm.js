import { useDispatch } from "react-redux"
import { createNewAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addNewAnecdote = (event) => {
        event.preventDefault()
        console.log(event.target)
        const content = event.target.anecdotes.value
        event.target.anecdotes.value = ''
        dispatch(createNewAnecdote(content))
    }

    return (
        <div>
            <h2>Create New</h2>
            <form onSubmit={addNewAnecdote}>
                <div><input name='anecdotes'/> <button type='submit'>Create</button> </div>
            </form>
        </div>
    )
}

export default AnecdoteForm