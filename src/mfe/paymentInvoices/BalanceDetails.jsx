import React from 'react';
import { Divider, Button } from '@mckesson/mcp-component-library';
import LinearSegmentChart from '@src/components/linearSegmentChart/LinearSegmentChart';
import InfoCards from '@src/components/infoCards/InfoCards';

const dummyData = [
  {
    label: 'Total Debit Balance',
    value: '$238,247.98',
    tooltipText: 'This is the total amount you owe.'
  },
  {
    label: 'Total Credit Balance',
    value: '$238,247.98',
    tooltipText: 'This is the total amount you are owed.'
  },
  {
    label: 'Past Due Balance',
    value: '$238,247.98',
    tooltipText: 'This is the total amount that is overdue.'
  }
];
export default function BalanceDetails() {
  return (
    <div className="card-container">
      <div className="flex-switch">
        <div className="metrics-container">
          <div className="metrics">
            {dummyData.map((data, index) => (
              <div key={index} className="info-cards-container">
                <InfoCards title={data.label} value={data.value} infoText={data.tooltipText} />
              </div>
            ))}
          </div>
          <div className="action-button">
            <Button size={'lg'}>PAY NOW</Button>
          </div>
        </div>
        <Divider className="divider-style" />
        <div className="metrics-chart">
          <LinearSegmentChart />
        </div>
      </div>
    </div>
  );
}
