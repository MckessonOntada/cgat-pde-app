import FloatingDrawer from '@src/components/floating-drawer';
import React from 'react';
import { Button, Tooltip } from '@mckesson/mcp-component-library';
import styles from './style.module.scss';
import { CustomDatepicker as DatePicker } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

const isSameDate = (d1, d2) => {
  const a = new Date(d1);
  const b = new Date(d2);

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

function maskString(value, mask = '*') {
  if (!value) return value;
  return value[0] + mask.repeat(value.length - 1);
}

const OrcaPatientVerificationPanel = ({ patientList, onClose, setVerifiedPatient, onAlert, orderDetails }) => {
  const { t: translateFn } = useTranslate();
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
      onAlert({
        type: 'success',
        description: translateFn('message.orcaPatientVerificationSuccess')
      });
      onClose();
    } else {
      onAlert({
        type: 'warning',
        description: translateFn('message.orcaPatientVerificationFailed')
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

  const getDisplayNameByFieldName = (fieldName) => {
    const materialConfig = orderDetails.therapyConfig?.config?.fields;
    return materialConfig?.find((field) => field.fieldName === fieldName)?.properties?.displayName || '';
  };

  return (
    <FloatingDrawer
      open={true}
      onClose={() => {
        onAlert({
          type: 'warning',
          description: translateFn('message:orcaPatientVerificationAbrupt', {
            patientId: getDisplayNameByFieldName('patientIdentifier'),
            medicalRecordNumber: getDisplayNameByFieldName('medicalRecordNumber')
          })
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
                description: translateFn('message:orcaPatientVerificationAbrupt', {
                  patientId: getDisplayNameByFieldName('patientIdentifier'),
                  medicalRecordNumber: getDisplayNameByFieldName('medicalRecordNumber')
                })
              });
              setVerifiedPatient(null);
              onClose();
            }}
            variant="secondary">
            {translateFn('captions.btnCancel')}
          </Button>
          <Button disabled={filteredPatient.length > 1 && !selectedPatient} onClick={handleOnSubmit}>
            {translateFn('captions.btnApply')}
          </Button>
        </div>
      }>
      <div className="stack">
        <div>
          <DatePicker id={'patient-date-of-birth'} name={'patient-date-of-birth'} label={translateFn('labels.dob')} onChangeFn={handleOnChange} />
          <div className="control-helper-text">{translateFn('helperText.orcaPatientVerificationDateControl')}</div>
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
                    <Tooltip body={patient.patientId}>
                      <p className={styles.patientId}>Patient ID - {patient.patientId}</p>
                    </Tooltip>
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
