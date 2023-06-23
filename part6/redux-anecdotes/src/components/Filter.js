import { useDispatch } from 'react-redux'
import { handleFilter } from '../reducers/filterReducer'
const Filter = () => {
    const dispatch = useDispatch()
    const handleChange = (event) => {
      // input-field value is in variable event.target.value
      dispatch(handleFilter(event.target.value))
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        Filter Anecdotes: <input onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter