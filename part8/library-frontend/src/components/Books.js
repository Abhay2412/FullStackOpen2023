import { useState } from 'react'
const Books = ({ show, books }) => {
  const [filter, setFilter] = useState('All Genres')
  const allGenres = books.map(b => b.genres).flat()
  const listOfGenres = [...new Set(allGenres)]
  listOfGenres.push('All Genres')
  
  if (!show) {
    return null
  }

  const bookToFilter = books.filter(book => filter === 'All Genres' ? book: book.listOfGenres.includes(filter))

  return (
    <div>
      <h2>Books</h2>
      <p>In genre <strong>{filter}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {bookToFilter.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {listOfGenres.map((genre) => (
          <button onClick={() => setFilter(genre)}>{genre}</button>
        ))}
      </div>
    </div>
  )
}

export default Books
