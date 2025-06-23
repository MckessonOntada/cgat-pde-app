import React, { useEffect } from 'react';
import Credits from '../credits';
import { usePaymentCredits } from '../../context/PaymentsCreditsContext';

function SelectCreditsListing(props) {
  const { selectedCredits, setSelectedCredits, totalCreditsCount, settotalCreditsCount, settotalCreditsAmount, desableSelection } = props;
  const { data, actualData: allCreditData } = usePaymentCredits();

  useEffect(() => {
    let _sum = data
      .filter((i) => i.billAmount)
      .reduce((accumulator, currentValue) => {
        return parseFloat(currentValue.billAmount), accumulator + parseFloat(currentValue.billAmount);
      }, 0);
    settotalCreditsCount(parseFloat(_sum).toFixed(2));
  }, [data]);
  useEffect(() => {
    const total = allCreditData.reduce((sum, item) => {
      const amount = parseFloat(item.openAmount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    settotalCreditsAmount(total.toFixed(2));
  }, [allCreditData]);

  return (
    <React.Fragment>
      <Credits selectedCredits={selectedCredits} setSelectedCredits={setSelectedCredits} selectableRows={true} desableSelection={desableSelection} />
    </React.Fragment>
  );
}
export default SelectCreditsListing;
