import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [blogResetState, setBlogResetState] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a,b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [blogResetState])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Logging with the following credentials: ', username, password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage({ text: 'Incorrect username or password', type: 'error' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  const addNewBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      blogService.create(blogObject)
        .then(blogToReturn => {
          setBlogs(blogs.concat(blogToReturn))
          setNotificationMessage({ text: `New blog created successfully with the title ${blogObject.title} from this author ${blogObject.author}`, type: 'notification' })
          setBlogResetState(!blogResetState)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
    catch(error) {
      console.error(error)
      setNotificationMessage({ text: `Could not add the following blog with the title ${blogObject.title} from this author ${blogObject.author}`, type: 'error' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  const updateLikes = async(id, blogObject) => {
    try {
      await blogService.update(id, blogObject)
      setBlogResetState(!blogResetState)
      setNotificationMessage({ text: `Liked the following blog with the title ${blogObject.title} from this author ${blogObject.author}`, type: 'notification' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
    catch(error) {
      console.error(error)
      setNotificationMessage({ text: `Could not like the following blog with the title ${blogObject.title} from this author ${blogObject.author}`, type: 'error' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogObjectToDelete) => {
    try {
      await blogService.remove(blogObjectToDelete.id)
      setBlogResetState(!blogResetState)
      setNotificationMessage({ text: `Deleted the following blog with the title ${blogObjectToDelete.title} from this author ${blogObjectToDelete.author}`, type: 'notification' })
      setBlogs(blogs.filter(blog => blog.id !== blogObjectToDelete.id))
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
    catch(error) {
      console.error(error)
      setNotificationMessage({ text: `Could not delete the following blog with the title ${blogObjectToDelete.title} from this author ${blogObjectToDelete.author}`, type: 'error' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  if(user === null) {
    return (
      <div>
        <h2>Log in to view Blogs</h2>
        <Notification message={notificationMessage} />
        <form onSubmit={handleLogin}>
          <div>
            Username <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)} id='username'/>
          </div>
          <div>
            Password <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)} id='password'/>
          </div>
          <button type='submit' id='login-button'>Login</button>
        </form>
      </div>
    )
  }
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }
  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage}/>
      <p>{user.name} has logged into the application <button type='submit' onClick={handleLogout}>Logout</button></p>
      <Togglable buttonLabel = "New Blog" ref={blogFormRef}>
        <NewBlogForm createNewBlog={addNewBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} isRemovableButtonStatus={blog.user && blog.user.username === user.username} />
      )}
    </div>
  )
}

export default App