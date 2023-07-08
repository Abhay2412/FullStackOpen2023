import { useDispatch } from 'react-redux'
import { createBlogs } from '../reducers/blogReducer'
import { setNotificationMessage } from '../reducers/notificationReducer'
import Togglable from './Togglable'
import { useRef } from 'react'
import { TextField, Button } from '@mui/material'

const NewBlogForm = () => {
  const dispatch = useDispatch()

  const blogFormRef = useRef()

  const addNewBlog = async (event) => {
    event.preventDefault()

    const title = event.target.titleInput.value
    const author = event.target.authorInput.value
    const url = event.target.urlInput.value

    const createNewBlog = {
      title: title,
      author: author,
      url: url,
    }
    dispatch(createBlogs(createNewBlog))
    dispatch(setNotificationMessage(`New blog created successfully with the title ${title} from this author ${author}`, 5))
  }

  return (
    <Togglable buttonLabel = "New Blog" ref={blogFormRef}>
      <h2>Add a new blog</h2>
      <form onSubmit={addNewBlog}>
        <div>
          <TextField id="titleInput" label='Write Blog Title' variant='outlined' margin='dense'/>
        </div>
        <div>
          <TextField id="authorInput" label='Write Blog Author Name' variant='outlined' margin='dense'/>
        </div>
        <div>
          <TextField id="urlInput" label='Provide Blog URL link' variant='outlined' margin='dense'/>
        </div>
        <p> </p>
        <Button variant='outlined' type='submit' id='add-new-blog-button'>Add New Blog</Button>
        <p> </p>
      </form>
    </Togglable>
  )
}

export default NewBlogForm