import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])
  
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
      setNotificationMessage({ text: 'Incorrect username or password', type: 'error'})
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }
  const addNewBlog = (event) => {
    event.preventDefault()
    const blogToAdd = {
      title: title, 
      author: author, 
      url: url, 
      user: user.id, 
    }
    blogService.create(blogToAdd)
    .then(blogToReturn => {
      setBlogs(blogs.concat(blogToReturn))
      setNotificationMessage({ text: `New blog created successfully with the title ${blogToAdd.title} from this author ${blogToAdd.author}`, type: 'notification' })
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    })
  }
  if(user == null) {
    return (
      <div>
        <h2>Log in to view Blogs</h2>
        <Notification message={notificationMessage} />
        <form onSubmit={handleLogin}>
          <div>
            Username <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            Password <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type='submit'>Login</button>
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
      <div>
        <h2>Add a new blog</h2>
        <form onSubmit={addNewBlog}>
          <div>
            Title: <input type='text' value={title} name='Title' onChange={({ target }) => setTitle(target.value)} />
          </div>
          <div>
            Author: <input type='text' value={author} name='Author' onChange={({ target }) => setAuthor(target.value)} />
          </div>
          <div>
            URL: <input type='text' value={url} name='URL' onChange={({ target }) => setUrl(target.value)} />
          </div>
          <button type='submit'>Add New Blog</button>
        </form>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App