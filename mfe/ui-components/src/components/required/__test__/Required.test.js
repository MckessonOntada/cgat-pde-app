import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Required } from '../Required'; 

describe('Required Component', () => {
  test('renders required label when isLegend is true', () => {
    render(<Required isLegend requiredLabel="Required" />);

    const requiredText = screen.getByText(/Required/i);
    expect(requiredText).toBeInTheDocument();

    const requiredIcon = screen.getByText('✱');
    expect(requiredIcon).toBeInTheDocument();
  });

  test('renders only asterisk and sr_only span when isLegend is false', () => {
    render(<Required isLegend={false} />);


    const requiredIcon = screen.getByText('✱');
    expect(requiredIcon).toBeInTheDocument();
  });

  test('renders default required label when requiredLabel prop is not provided', () => {
    render(<Required isLegend />);

    const requiredText = screen.getByText('Required');
    expect(requiredText).toBeInTheDocument();
  });

  test('applies translateClass to the required label when isLegend is true', () => {
    const translateClass = {
      requiredLabel: 'translated-required-label'
    };

    render(
      <Required
        isLegend
        requiredLabel="Required"
        translateClass={translateClass}
      />
    );

    const requiredText = screen.getByText('Required');
    expect(requiredText).toHaveClass('translated-required-label');
  });
});