import { SyntheticEvent, useState, useContext } from "react";
import { Diagnosis, HealthCheckRating, EntryWithoutId } from "../../types";
import DiagnosesContext from "../../contexts/diagnoseContext";
import { OutlinedInput, Typography, TextField, Grid, Button, InputLabel, Select, SelectChangeEvent, MenuItem } from "@mui/material";

interface Props {
    onCancel: () => void;
    onSubmit: (values: EntryWithoutId) => void;
};

interface HealthCheckRatingOption {
    value: number;
    label: string;
};

const healthCheckRatingOption: HealthCheckRatingOption[] = Object.values(HealthCheckRating).filter((value) => typeof value === "number").map(
    (v) => ({
        value: v as number,
        label: HealthCheckRating[v as number],
    })
);

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis["code"]>>([])
    const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy)
    const [dischargeDate, setDischargeDate] = useState('')
    const [dischargeCriteria, setDischargeCriteria] = useState('')
    const [employerName, setEmployerName] = useState('')
    const [sickLeaveStart, setSickLeaveStart] = useState('')
    const [sickLeaveEnd, setSickLeaveEnd] = useState('')
    const [entryOptions, setEntryOptions] = useState('')

    const diagnoses = useContext(DiagnosesContext);

    const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
        event.preventDefault();

        const healthRatingValue = Number(event.target.value);
        const healthCheckRating = Object.values(HealthCheckRating);

        if(healthRatingValue && healthCheckRating.includes(healthRatingValue)) {
            setHealthCheckRating(healthRatingValue);
        }
    };

    const onDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
        event.preventDefault();

        const diagnosisCodeValue = event.target.value;
        typeof diagnosisCodeValue === "string" ? setDiagnosisCodes(diagnosisCodeValue.split(', ')) : setDiagnosisCodes(diagnosisCodeValue);
    };

    const addEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        const baseEntry = {description, date, specialist, diagnosisCodes};
        switch (entryOptions) {
            case "Hospital":
                onSubmit({ type: "Hospital", ...baseEntry, discharge: {date: dischargeDate, criteria: dischargeCriteria} });
                break;
            case "OccupationalHealthcare":
                onSubmit({ type: "OccupationalHealthcare", ...baseEntry, employerName: employerName, sickLeave: sickLeaveStart && sickLeaveEnd ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }: undefined });
                break;
            case "HealthCheck":
                onSubmit({ type: "HealthCheck", ...baseEntry, healthCheckRating });
        };
    };

    return (
        <div>
            <Typography component="h4" variant="h4">New Entry</Typography>
            <InputLabel style={{ marginTop: 25 }}>Entry Options</InputLabel>
            <Select label="Option" fullWidth value={entryOptions} onChange={({ target }) => setEntryOptions(target.value)}>
                <MenuItem key="Hospital" value="Hospital">Hospital</MenuItem>
                <MenuItem key="OccupationalHealthcare" value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
                <MenuItem key="HealthCheck" value="HealthCheck">Health Check</MenuItem>
            </Select>
            <form onSubmit={addEntry}>
                <InputLabel style={{ marginTop: 25 }}>Description</InputLabel>
                <TextField label='Description' fullWidth value={description} onChange={({ target }) => setDescription(target.value)}/>
                <InputLabel style={{ marginTop: 25 }}>Date</InputLabel>
                <TextField type='date' fullWidth value={date} onChange={({ target }) => setDate(target.value)}/>
                <InputLabel style={{ marginTop: 25 }}>Specialist</InputLabel>
                <TextField label='Specialist' fullWidth value={specialist} onChange={({ target }) => setSpecialist(target.value)}/>
                <InputLabel style={{ marginTop: 25 }}>Diagnosis Codes</InputLabel>
                <Select label='Diagnosis Codes' multiple fullWidth value={diagnosisCodes} onChange={onDiagnosisCodesChange} input={<OutlinedInput label="Multiple Select"/>}>{diagnoses.map(d => <MenuItem key={d.code} value={d.code}>{d.code}</MenuItem>)}</Select>
               {entryOptions === "Hospital" && <>
                <InputLabel style={{ marginTop: 25 }}>Discharge Date</InputLabel>
                <TextField type='date' fullWidth value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)}/>
                <InputLabel style={{ marginTop: 25 }}>Discharge Criteria</InputLabel>
                <TextField label='Discharge Criteria' fullWidth value={dischargeCriteria} onChange={({ target }) => setDischargeCriteria(target.value)}/>
               </>}
               {entryOptions === "OccupationalHealthcare" && <>
                <InputLabel style={{ marginTop: 25 }}>Employer Name</InputLabel>
                <TextField label='Employer Name' fullWidth value={employerName} onChange={({ target }) => setEmployerName(target.value)}/>
                <InputLabel style={{ marginTop: 25 }}>Sick Leave: </InputLabel>
                <InputLabel style={{ marginTop: 5 }}>Start Date</InputLabel>
                <TextField type='date' fullWidth value={sickLeaveStart} onChange={({ target }) => setSickLeaveStart(target.value)}/>
                <InputLabel style={{ marginTop: 5 }}>End Date</InputLabel>
                <TextField type='date' fullWidth value={sickLeaveEnd} onChange={({ target }) => setSickLeaveEnd(target.value)}/>
               </>}
               {entryOptions === "Healthcheck" && <>
                <InputLabel style={{ marginTop: 25 }}>Health Check Rating</InputLabel>
                <Select label='Health Check Rating' fullWidth value={healthCheckRating.toString()} onChange={onHealthCheckRatingChange}>{healthCheckRatingOption.map(o => <MenuItem key={o.label} value={o.value}>{o.label}</MenuItem>)}</Select>
               </>}
                <p> </p>
                <Grid>
                    <Grid item>
                        <Button color='secondary' variant='contained' style={{ float: 'left' }} type='button' onClick={onCancel}>Cancel</Button>
                    </Grid>
                    <Grid item>
                        <Button style={{ float: 'right' }} type='submit' variant='contained'>Add</Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default AddEntryForm;