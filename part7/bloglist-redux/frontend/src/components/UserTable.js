import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'
import { Link } from 'react-router-dom'

const UserTable = () => {
  const displayUsers = useSelector(state => state.users)

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><h4>Usernames</h4></TableCell>
              <TableCell><h4>Amount of Blogs Created</h4></TableCell>
            </TableRow>
            {displayUsers.map(displayUser => (
              <TableRow key={displayUser.id}>
                <TableCell>
                  <Link to={`/users/${displayUser.id}`}>{displayUser.username}</Link>
                </TableCell>
                <TableCell>
                  {displayUser.blogs.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>
    </div>
  )
}

export default UserTable