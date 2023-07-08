import { useState } from 'react'
import PropTypes from 'prop-types'
import { useQueryClient, useMutation } from 'react-query'
import { updateLikes, deleteBlog } from '../requests'
import { useUserValue } from '../userContext'
import { useNotificationDispatch } from '../notificationContext'

const Blog = ({ blog }) => {
  const queryClient = useQueryClient()

  const user = useUserValue()

  const dispatch = useNotificationDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLikeMutation = useMutation(updateLikes, {
    onSuccess: (updatedLike) => {
      console.log('update', updatedLike)

      const blogs = queryClient.getQueryData('blogs')

      queryClient.setQueryData('blogs', blogs.map(blog =>
        blog.id === updatedLike.id ? updatedLike : blog
      ))
    }
  })

  const handleLike = async (blog) => {
    try {
      addLikeMutation.mutate({ ...blog, likes: blog.likes + 1 })
      await dispatch({ type: 'showNotification', payload: `Liked the following blog with the title ${blog.title} from this author ${blog.author}` })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    }
    catch(error) {
      console.error(error)
      await dispatch({ type: 'showNotification', payload: `Could not like the following blog with the title ${blog.title} from this author ${blog.author}` })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    }
  }

  const deleteMutation = useMutation(deleteBlog, {
    onSuccess: (blogToRemove) => {
      const blogs = queryClient.getQueryData('blogs')

      queryClient.setQueryData('blogs', blogs.filter(blog => blog.id !== blogToRemove.id))
    }
  })

  const handleDelete = async (blogObjectToDelete) => {
    try {
      if(window.confirm(`Remove blog with the following title ${blogObjectToDelete.title} by this author ${blogObjectToDelete.author}`)) {
        deleteMutation.mutate(blogObjectToDelete)
      }
      await dispatch({ type: 'showNotification', payload: `Deleted the following blog with the title ${blogObjectToDelete.title} from this author ${blogObjectToDelete.author}` })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)

    }
    catch(error) {
      console.error(error)
      await dispatch({ type: 'showNotification', payload: `Could not delete the following blog with the title ${blogObjectToDelete.title} from this author ${blogObjectToDelete.author}` })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 5000)
    }
  }
  const isRemovableButtonStatus = blog.user && blog.user.username === user.username
  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='defaultBlogView'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>View Blog Details</button>
      </div>
      <div style={showWhenVisible} className='detailedBlogView'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>Hide Blog Details</button>
        <p>{blog.url}</p>
        <p id='likes-count'> {blog.likes} Likes <button onClick={() => handleLike(blog)}>Like</button></p>
        <p>{blog.user !== null && blog.user.name}</p>
        <p> </p>
        {isRemovableButtonStatus && (
          <div>
            <button style={{ backgroundColor: '#2D77ED' }} onClick={() => handleDelete(blog)} id='remove-blog-button'>Remove Blog</button>
          </div>
        )}
        <p> </p>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog