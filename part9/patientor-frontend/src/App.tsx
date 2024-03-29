import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';
import DiagnosesContext from "./contexts/diagnoseContext";
import { apiBaseUrl } from "./constants";
import { Patient, Diagnosis } from "./types";

import patientService from "./services/patients";
import diagnoseService from "./services/diagnosis";
import PatientListPage from "./components/PatientListPage";
import SinglePatientView from "./components/SinglePatientView";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
    
    const fetchDiagnoseList = async () => {
      const allDiagnoses = await diagnoseService.getAllDiagnosis();
      setDiagnoses(allDiagnoses);
    };
    void fetchDiagnoseList();
  }, []);

  const match = useMatch('/patients/:id');
  const patientToView = match ? patients.find(p => p.id === match.params.id) : null
  
  return (
    <div className="App">
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <DiagnosesContext.Provider value={diagnoses}>
            <Routes>
              <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
              <Route path="/patients/:id" element={<SinglePatientView patient={patientToView} diagnoses={diagnoses}/>} />
            </Routes>
          </DiagnosesContext.Provider>
        </Container>
    </div>
  );
};

export default App;
