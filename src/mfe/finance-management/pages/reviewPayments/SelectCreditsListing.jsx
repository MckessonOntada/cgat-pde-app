import React, { useEffect } from 'react';
import Credits from '../credits';
import { usePaymentCredits } from '../../context/PaymentsCreditsContext';

function SelectCreditsListing(props) {
  const { selectedCredits, setSelectedCredits, totalCreditsCount, settotalCreditsCount } = props;
  const { data } = usePaymentCredits();

  useEffect(() => {
    let _sum = data
      .filter((i) => i.billAmount)
      .reduce((accumulator, currentValue) => {
        return parseFloat(currentValue.billAmount), accumulator + parseFloat(currentValue.billAmount);
      }, 0);
    settotalCreditsCount(parseFloat(_sum).toFixed(2));
  }, [data]);

  return (
    <React.Fragment>
      <Credits selectedCredits={selectedCredits} setSelectedCredits={setSelectedCredits} selectableRows={true} />
    </React.Fragment>
  );
}
export default SelectCreditsListing;
