import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog