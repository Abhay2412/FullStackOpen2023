const initialState = {
  Good: 0,
  Okay: 0,
  Bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return {
        ...state,
        Good: state.Good + 1
      } 
    case 'OKAY':
      return {
        ...state,
        Okay: state.Okay + 1
      }
    case 'BAD':
      return {
        ...state,
        Bad: state.Bad + 1
      }
    case 'ZERO':
      return {
        Good: 0,
        Okay: 0,
        Bad: 0
      }
    default: return state
  }
  
}

export default counterReducer