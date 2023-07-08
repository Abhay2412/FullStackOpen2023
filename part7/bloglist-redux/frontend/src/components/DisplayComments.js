import { useSelector } from 'react-redux'
import NewCommentForm from './NewCommentForm'

const DisplayComments = ({ id }) => {
  const comments = useSelector(state => state.comments)

  return (
    <div>
      <h3>Comments</h3>
      <NewCommentForm id={id} />
      {comments.map((comment) => (
        <li key={comment.id}>{comment.content}</li>
      ))}
    </div>
  )
}

export default DisplayComments