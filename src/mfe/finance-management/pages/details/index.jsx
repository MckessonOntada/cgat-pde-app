import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useAccountContext } from '../../context/AccountContext';

function Details(props) {
  const { billNumber, confirmationNumber } = useParams();
  console.log('🚀 ~ Details ~ billNumber:', billNumber);
  console.log('🚀 ~ Details ~ confirmationNumber:', confirmationNumber);
  const { selectedAccount } = useAccountContext();
  console.log('🚀 ~ Details ~ selectedAccount:', selectedAccount);
  return <div>Details</div>;
}

Details.propTypes = {};

export default Details;
