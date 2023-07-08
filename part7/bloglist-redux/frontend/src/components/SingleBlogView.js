import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateLikes } from '../reducers/blogReducer'
import { setNotificationMessage } from '../reducers/notificationReducer'
import { Button } from '@mui/material'
const SingleBlogView = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)

  const id = useParams().id

  const blog = blogs.find(n => n.id === String(id))

  if(!blog) {
    return null
  }

  const handleLike = () => {
    dispatch(updateLikes(blog))
    dispatch(setNotificationMessage(`Liked the following blog with the title ${blog.title} from this author ${blog.author}`, 5))
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <p>{blog.url}</p>
      <p>{blog.likes} <Button variant='outlined' onClick={handleLike}>Like</Button></p>
      <p>this blog has been added by the following user {blog.user !== null && blog.user.name}</p>
    </div>
  )
}

export default SingleBlogView