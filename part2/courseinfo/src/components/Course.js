const Header = (props) => {
    console.log(props)
    return (
      <div>
        <h1>{props.name}</h1>
      </div>
    )
  }
  
  const Part = (props) => {
    console.log(props)
    return (
      <div>
        <p>{props.parts.name} {props.parts.exercises}</p>
      </div>
    )
  }
  
    const Content = (props) => {
    
      const partsFromCourses = props.parts.map(element => { 
        return <Part key={element.id} parts={element} /> 
    })
    
      return (
        <div>
          {partsFromCourses}
        </div>
      )
    }
  const Total = (props) => {
    console.log(props)
    const totalNumberOfExercises = props.parts.reduce((sum, order) => sum + order.exercises, 0)
    return (
      <div>
        <p>Number of exercises {totalNumberOfExercises}</p>
      </div>
    )
  }

  const Course = (props) => {
    console.log(props)
    return(
        <div>
            <Header name={props.course.name} />
            <Content parts={props.course.parts} />
            <Total parts={props.course.parts} />
        </div>
    )
  }

  export default Course;