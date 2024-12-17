import React from 'react';
import PropTypes from 'prop-types';
import { LinearSegmentChart as LSChart } from '@mckesson/mcp-component-library';

const mockData = [
  { label: '1-30 days over', segmentValue: 200, color: '#BED630' },
  { label: '31-60 days over', segmentValue: 900, color: '#F7C91E' },
  { label: '61-90 days over', segmentValue: 2200, color: '#FF9839' },
  { label: '91+ days over', segmentValue: 33000, color: '#DB3A29' }
];

const LinearSegmentChart = (props) => {
  return <LSChart data={mockData} unit={'$'} />;
};

LinearSegmentChart.propTypes = {};

export default LinearSegmentChart;
