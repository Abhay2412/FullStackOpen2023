import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleUserView = () => {
  const users = useSelector(state => state.users)
  const id = useParams().id

  const singleUserToDisplay = users.find(n => n.id === String(id))

  if(!singleUserToDisplay) {
    return null
  }

  return (
    <div>
      <h2>{singleUserToDisplay.username}</h2>
      <h3>has added these following blogs: </h3>
      <ul>
        {singleUserToDisplay.blogs.map(blog => <li key={blog.id} >{blog.title}</li>)}
      </ul>
    </div>
  )
}

export default SingleUserView