import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, deleteBlog, isRemovableButtonStatus }) => {
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

  const handleLike = () => {
    const blogToUpdate = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    updateLikes(blog.id, blogToUpdate)
  }

  const handleDelete = () => {
    if(window.confirm(`Remove blog with the following title ${blog.title} by this author ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='defaultBlogView'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>View Blog Details</button>
      </div>
      <div style={showWhenVisible} className='detailedBlogView'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>Hide Blog Details</button>
        <p>{blog.url}</p>
        <p id='likes-count'> {blog.likes} Likes <button onClick={handleLike}>Like</button></p>
        <p>{blog.user !== null && blog.user.name}</p>
        <p> </p>
        {isRemovableButtonStatus && (
          <div>
            <button style={{ backgroundColor: '#2D77ED' }} onClick={handleDelete} id='remove-blog-button'>Remove Blog</button>
          </div>
        )}
        <p> </p>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog