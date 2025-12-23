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

function maskString(value, mask = '*') {
  if (!value) return value;
  return value[0] + mask.repeat(value.length - 1);
}

const OrcaPatientVerificationPanel = ({ patientList, onClose, setVerifiedPatient, onAlert }) => {
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [filteredPatient, setFilteredPatient] = React.useState([]);
  const [date, setDate] = React.useState(null);

  const handleOnChange = (value) => {
    setDate(new Date(value));
    const filteredPatient = patientList.filter((patient) => isSameDate(patient.dateOfBirth, new Date(value)));
    if (filteredPatient.length === 1) {
      setSelectedPatient(filteredPatient[0]);
    }
    setFilteredPatient(filteredPatient);
  };
  const handleOnSubmit = () => {
    if (selectedPatient && isSameDate(new Date(selectedPatient.dateOfBirth), date)) {
      setVerifiedPatient(selectedPatient);
      onClose();
    } else {
      onAlert({
        type: 'warning',
        description:
          'The Orca Bio Patient ID or MRN and Date of Birth entered is not valid. Please continue entering remaining order details and submit the order. A Customer Support representative will contact you shortly.'
      });
      setVerifiedPatient(null);
      onClose();
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
      onClose={() => {
        onAlert({
          type: 'warning',
          description: 'Verification was not successful. Please re-enter the Patient ID or MRN to restart the verification process.'
        });
        setVerifiedPatient(null);
        onClose();
      }}
      anchor="right"
      heading={'Verify Patient'}
      controls={
        <div className="controls">
          <Button
            onClick={() => {
              onAlert({
                type: 'warning',
                description: 'Verification was not successful. Please re-enter the Patient ID or MRN to restart the verification process.'
              });
              setVerifiedPatient(null);
              onClose();
            }}
            variant="secondary">
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
        {date && filteredPatient.length > 1 && (
          <div className={styles.cardContainer}>
            {filteredPatient.map((patient, index) => {
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
                    <p>{`${maskString(patient.firstName)} ${maskString(patient.lastName)}`}</p>
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
