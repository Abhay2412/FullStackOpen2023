import { useDispatch } from 'react-redux'
import { setNotificationMessage } from '../reducers/notificationReducer'
import { createNewComments } from '../reducers/commentReducer'
import { TextField, Button } from '@mui/material'

const NewCommentForm = ({ id }) => {
  const dispatch = useDispatch()

  const addNewComment = async(event) => {
    event.preventDefault()

    const commentContentToAdd = event.target.commentContentInput.value

    event.target.commentContentInput.value = ''

    dispatch(createNewComments(id, commentContentToAdd))
    dispatch(setNotificationMessage(`The following comment with the content ${commentContentToAdd} has been posted`, 5))
  }
  return (
    <div>
      <form onSubmit={addNewComment}>
        <div>
          <TextField id="commentContentInput" label='Comment Content' variant='outlined' margin='dense'/>
        </div>
        <p> </p>
        <Button variant='outlined' type='submit'>Post New Comment</Button>
        <p> </p>
      </form>
    </div>
  )
}

export default NewCommentForm