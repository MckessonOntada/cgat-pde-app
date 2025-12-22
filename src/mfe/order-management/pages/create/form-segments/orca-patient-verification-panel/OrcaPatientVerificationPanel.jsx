import FloatingDrawer from '@src/components/floating-drawer';
import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import styles from './style.module.scss';
import { CustomDatepicker as DatePicker } from '@mckesson/mcp-component-library';

const isSameDate = (d1, d2) => {
  const a = new Date(d1);
  const b = new Date(d2);

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

const OrcaPatientVerificationPanel = ({ patientList, onClose }) => {
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [date, setDate] = React.useState(null);
  React.useEffect(() => {
    if (patientList.length === 1) {
      setSelectedPatient(patientList[0]);
    }
  }, []);
  const handleOnChange = (value) => {
    setDate(new Date(value));
  };
  const handleOnSubmit = () => {
    if (isSameDate(new Date(selectedPatient.dateOfBirth), date)) {
      onClose(selectedPatient);
    } else {
      onClose({ id: -1 });
    }
  };
  const handleOnSelection = (id) => {
    const targetPatientDetails = patientList.find((patient) => id === patient.id);
    if (targetPatientDetails) {
      setSelectedPatient(targetPatientDetails);
    }
  };

  return (
    <FloatingDrawer
      open={true}
      onClose={onClose}
      anchor="right"
      heading={'Verify Patient'}
      controls={
        <div className="controls">
          <Button onClose={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleOnSubmit}>Apply</Button>
        </div>
      }>
      <div className="stack">
        <div>
          <DatePicker id={'patient-date-of-birth'} name={'patient-date-of-birth'} label={'Date Of Birth'} onChangeFn={handleOnChange} />
          <div className="control-helper-text">
            {"Note: We ask for the patient's Date of Birth to make sure you're accessing the right record and keeping patient information secure."}
          </div>
        </div>
        {patientList.length > 1 && (
          <div className={styles.cardContainer}>
            {patientList.map((patient, index) => {
              return (
                <label
                  key={index}
                  className={`${styles.card} ${selectedPatient?.id === patient.id ? styles.selected : null}`}
                  onClick={() => handleOnSelection(patient.id)}>
                  <input
                    type="radio"
                    name="card-radio"
                    value={patient.id}
                    checked={selectedPatient?.id === patient.id}
                    onChange={() => handleOnSelection(patient.id)}
                    style={{ display: 'none' }}
                  />
                  <div className={styles.cardContent}>
                    <p>{`${patient.firstName} ${patient.lastName}`}</p>
                    <p>{patient.id}</p>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </FloatingDrawer>
  );
};

export default OrcaPatientVerificationPanel;
