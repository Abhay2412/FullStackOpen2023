import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'
import Select from 'react-select'

const Authors = ({ show, authors, setError }) => {
  const [nameOptions, setNameOptions] = useState(null)
  const [born, setBorn] = useState('')

  const [ changeAuthor, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries:[{ query: ALL_AUTHORS }]
  })

  const options = []
  authors.forEach(a => options.push(
      {
        value: a.name,
        label: a.name
    }))

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError('No author found')
    }
  }, [result.data]) // eslint-disable-line 

  if (!show) {
    return null
  }
  const submit = async (event) => {
    event.preventDefault()

    const name = nameOptions.value

    changeAuthor({ variables: { name, born } })
    setNameOptions('')
    setBorn('')
  }


  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p> </p>
      <form onSubmit={submit}>
      <div>
          <Select
            value={nameOptions}
            onChange={setNameOptions}
            options={options}
          />
        </div>
        <div>
          Born: <input value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <p> </p>
        <button type='submit'>Update Author</button>
      </form>
    </div>
  )
}

export default Authors
