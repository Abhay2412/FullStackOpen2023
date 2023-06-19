import { useState } from 'react'

const NewBlogForm = ({ createNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrl = (event) => {
    setUrl(event.target.value)
  }

  const addNewBlog = (event) => {
    event.preventDefault()
    createNewBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={addNewBlog}>
        <div>
            Title: <input type='text' value={title} name='Title' onChange={handleTitle} />
        </div>
        <div>
            Author: <input type='text' value={author} name='Author' onChange={handleAuthor} />
        </div>
        <div>
            URL: <input type='text' value={url} name='URL' onChange={handleUrl} />
        </div>
        <button type='submit'>Add New Blog</button>
      </form>
    </div>
  )
}

export default NewBlogForm