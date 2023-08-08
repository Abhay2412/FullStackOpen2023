import { useState } from "react";
import axios from "axios";
import patientService from "../../services/patients";
import AddEntryModal from "../AddEntryModal";
import { Patient, Gender, Diagnosis, Entry, EntryWithoutId, HealthCheckRating } from "../../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import { Typography, Box, Button } from "@mui/material";

interface Props {
    patient: Patient | null | undefined
    diagnoses: Diagnosis[]
};

const HealthRating = (health: HealthCheckRating) => {
    switch(health) {
        case 0:
            return <FavoriteIcon sx={{ color: "green" }}/>;
        case 1:
            return <FavoriteIcon sx={{ color: "yellow" }}/>;
        case 2:
            return <FavoriteIcon sx={{ color: "pink" }}/>;
        case 3:
            return <FavoriteIcon sx={{ color: "red" }}/>;
    }
}

const assertNever = (value: never): never => {
    throw new Error (`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
    switch(entry.type) {
        case "Hospital":
            return(<div>
                <p>Discharge date: {entry.discharge.date}</p>
                <ul>
                    <li>Criteria: <i>{entry.discharge.criteria}</i></li>
                </ul>
            </div>);
        case "OccupationalHealthcare":
            return(<div>
                {entry.sickLeave?<p>Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</p> : null}
            </div>);
        case "HealthCheck":
            return(<div>{HealthRating(entry.healthCheckRating)}</div>);
        default:
            return assertNever(entry);
    }
};

const genderIdentification = (gender: Gender | undefined) => {
    switch(gender) {
        case "female":
            return <FemaleIcon/>;
        case "male":
            return <MaleIcon/>;
        default:
            return null;
    }
};

const SinglePatientView = ({ patient, diagnoses }: Props) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    }

    const submitAddEntry = async (values: EntryWithoutId) => {
        try {
            if(patient) {
                const entryToAdd = await patientService.addingEntry(patient.id, values);
                patient = {...patient, entries: patient.entries.concat(entryToAdd)};
                setModalOpen(false);
            }
        } catch(error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error?.response?.data && typeof error?.response?.data === 'string') {
                    const errorMessage = error.response.data.replace('Something went wrong. Error: ', '');
                    setError(errorMessage);
                } else {
                    setError("Unrecognized Axios Error");
                }
            }
            else {
                setError("Unknown Error");
            }
        }
    };
    return (
        <div>
            <p> </p>
            <Typography component="h4" variant="h4">{patient?.name}{genderIdentification(patient?.gender)}</Typography>
            <p>SSN: {patient?.ssn}</p>
            <p>Occupation: {patient?.occupation}</p>
            <p> </p>
            <AddEntryModal onSubmit={submitAddEntry} error={error} onClose={closeModal} modalOpen={modalOpen}/>
            <p> </p>
            <Button variant='contained' onClick={() => openModal()}> Add New Entry</Button>
            <p> </p>
            <Typography component="h4" variant="h4">Entries</Typography>
            {patient?.entries.map(e => <div key={e.id}>
                <Box sx={{ border: '2px solid black', borderRadius: 6, padding: 1, margin: 2  }} >
                    <p>{e.date} {e.type === "OccupationalHealthcare" ? e.employerName ? <p><WorkIcon/> {e.employerName}</p> : <WorkIcon /> : <MedicalServicesIcon />} </p>
                    <p><i>{e.description}</i></p>
                <ul>{e.diagnosisCodes?.map(d => {const diagnosis = diagnoses.find(diagnose => diagnose.code === d)?.name
                    return ( <li key={d}>{d} {diagnosis? diagnosis : null}</li> )}
                        )}
                </ul>
                <EntryDetails entry={e}/>
                     <p>diagnose by {e.specialist}</p>
                  </Box> 
            </div>)}
        </div>
    );
};

export default SinglePatientView;