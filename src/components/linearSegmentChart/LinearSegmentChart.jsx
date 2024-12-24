import React from 'react';
import PropTypes from 'prop-types';
import { LinearSegmentChart as LSChart } from '@mckesson/mcp-component-library';

const LinearSegmentChart = ({ data = [], unit = '', ...props }) => {
  return <LSChart data={data} unit={unit} />;
};

LinearSegmentChart.propTypes = {
  data: PropTypes.array,
  unit: PropTypes.string
};

export default LinearSegmentChart;
