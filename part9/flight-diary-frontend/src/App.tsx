import { useState, useEffect } from "react";
import { DiaryEntry, Visibility, Weather } from "./types";
import { getAll, createNewDiary } from "./services/diaries";
import { TextField, SelectChangeEvent, InputLabel, Grid, Button, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio  } from "@mui/material";
const App = () => {
  const [newDiary, setNewDiary] = useState('');
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState(Weather.Windy);
  const [visibility, setVisibility] = useState(Visibility.Ok);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getAll().then(data => {
      setDiaries(data)
    })
  }, []);

  interface VisibilityOption {
    value: Visibility;
    label: string;
  }

  const visibilityOptions: VisibilityOption[] = Object.values(Visibility).map(v => ({
    value: v, label: v.toString()
  }));

  const onVisibilityChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if(typeof event.target.value === "string") {
      const value = event.target.value;
      const visibility = Object.values(Visibility).find(i => i.toString() === value);
      if (visibility) {
        setVisibility(visibility)
      }
    }
  };

  interface WeatherOption {
    value: Weather;
    label: string;
  }

  const weatherOptions: WeatherOption[] = Object.values(Weather).map(w => ({
    value: w, label: w.toString()
  }));

  const onWeatherChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if(typeof event.target.value === "string") {
      const value = event.target.value;
      const weather = Object.values(Weather).find(j => j.toString() === value);
      if (weather) {
        setWeather(weather)
      }
    }
  };

  const addingNewFlightDiary = (event: React.SyntheticEvent) => {
    event.preventDefault()
    createNewDiary({
      date,
      visibility,
      weather,
      comment
    }).then(data => {
      setDiaries(diaries.concat(data));
      setDate('');
      setComment('');
    }).catch(err => {
      const errorMessage = err.response.data.message;
      setError(errorMessage);
    })
    setNewDiary('');
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      <h1>Add Flight Diary Entry</h1>
      <form onSubmit={addingNewFlightDiary}>
        <TextField type="date" value={date} onChange={({target}) => setDate(target.value)}/>
        <div>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group" style={{ marginTop: 30 }}>Visibility</FormLabel>
            <RadioGroup row name="Visibility" value={visibility} onChange={onVisibilityChange}>{visibilityOptions.map(option => <FormControlLabel key={option.label} value={option.value} control={<Radio/>} label={option.label}/>)}</RadioGroup>
          </FormControl>
        </div>
        <div>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group" style={{ marginTop: 30 }}>Weather</FormLabel>
            <RadioGroup row name="Weather" value={weather} onChange={onWeatherChange}>{weatherOptions.map(option => <FormControlLabel key={option.label} value={option.value} control={<Radio/>} label={option.label}/>)}</RadioGroup>
          </FormControl>
        </div>
        <p> </p>
        <TextField label="Comment" value={comment} onChange={({target}) => setComment(target.value)}/>
        <Grid>
          <Grid item>
            <Button style={{ marginTop: 35 }} color='primary' type='submit' variant='contained'>Submit</Button>
          </Grid>
        </Grid>
      </form>
      <h1>Diary Entries</h1>
      {diaries.map(diary => <div key={diary.id}>
        <h3>{diary.date}</h3>
        <p>Visibility: {diary.visibility}</p>
        <p>Weather: {diary.weather}</p>
      </div>)}
    </div>
  )
}

export default App;