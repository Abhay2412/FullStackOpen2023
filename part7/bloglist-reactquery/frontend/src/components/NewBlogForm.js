import { useQueryClient, useMutation } from 'react-query'
import { useNotificationDispatch } from '../notificationContext'
import { createNewBlog } from '../requests'

const NewBlogForm = () => {
  const queryClient = useQueryClient()

  const dispatch = useNotificationDispatch()


  const addNewBlogMutation = useMutation(createNewBlog, {
    onSuccess: (blogToAdd) => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(blogToAdd))
    },
    onError: () => {
      dispatch({ type: 'showNotification', payload: 'Could not add the blog' })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    }
  })
  const addNewBlog = async (event) => {
    event.preventDefault()
    const title = event.target.titleInput.value
    const author = event.target.authorInput.value
    const url = event.target.urlInput.value

    event.target.titleInput.value = ''
    event.target.authorInput.value = ''
    event.target.urlInput.value = ''

    addNewBlogMutation.mutate({ title, author, url })
    dispatch({ type: 'showNotification', payload: `New blog created successfully with the title ${title} from this author ${author}` })
    setTimeout(() => {
      dispatch({ type: 'hideNotification' })
    }, 5000)
  }

  return (
    <div className="formDiv">
      <h2>Add a new blog</h2>
      <form onSubmit={addNewBlog}>
        <div>
            Title: <input type='text' placeholder='Write Blog Title' id='titleInput' />
        </div>
        <div>
            Author: <input type='text' placeholder='Write Blog Author Name' id='authorInput' />
        </div>
        <div>
            URL: <input type='text' placeholder='Provide Blog URL link' id='urlInput'/>
        </div>
        <button type='submit' id='add-new-blog-button'>Add New Blog</button>
      </form>
    </div>
  )
}

export default NewBlogForm